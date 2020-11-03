'use strict';
const db = uniCloud.database();
const activeOrder = db.collection('active-order');
const inactiveOrder = db.collection('inactive-order');
const acceptedOrder = db.collection('accepted-order');
const orderComment = db.collection('order-comment');
const dbCmd = db.command;

const _orderStatus = {
    INITIALING: 0,
    CREATED: 1,
    ACCEPTED: 2,
    SERVING: 3,
    EVALUATING: 4,
    COMPLETED: 5,
    CANCELING: -3,
    CANCELED: -2,
    EXCEPTION: -1,
}

function isActiveStatus(status) {
    return status == _orderStatus.INITIALING
        || status == _orderStatus.ACCEPTED
        || status == _orderStatus.SERVING
        || status == _orderStatus.CANCELING
        || status == _orderStatus.EXCEPTION
}

function isCreatedStatus(status) {
    return status == _orderStatus.CREATED;
}

function isInactiveStatus(status) {
    return status == _orderStatus.EVALUATING 
        || status == _orderStatus.COMPLETED
        || status == _orderStatus.CANCELED
}

const serviceType_creater = {
    INITIAL: 1,
    CREATE: 2,
    EVALUATE: 3,
    CANCEL: 4,
    GET: 5,
}

const serviceType_server = {
    TAKE: 1,
    START: 2,
}

const side = {
    CREATER: 0,
    SERVER: 1,
}

function getDeposit(cost) {
    const depositRate = 0.25;
    let res = Math.ceil(cost * depositRate * 10) / 10;
    return res;
}

function getTotalCost(cost) {
    let res = 0;
    for (let item in cost) {
        res = res + cost[item];
    }
    return res;
}

exports.main = async (event) => {
    
    const userId = event.userId;
    try {
        switch(event.side) {
            case side.CREATER:     // creater
                switch(event.serviceType) {
                    case serviceType_creater.INITIAL:  {// initial
                        const order = event.order;
                        console.log(order);
                        order.deposit = getDeposit(getTotalCost(order.cost));
                        const orderId = await initial({
                            userId,
                            order,
                        })
                        return {
                            orderId,
                            success: true
                        }
                    }
                    case serviceType_creater.CREATE: {
                        const {
                            orderId
                        } = event;

                        await create({orderId});
                        return {
                            success: true,
                        }
                    }
                    case serviceType_creater.EVALUATE: {
                        const {
                            orderId, score, comment
                        } = event;
                        const side = 0;

                        await evaluate({orderId, side, score, comment});
                        return {
                            success: true,
                        }
                    }
                    case serviceType_creater.CANCEL: {
                        const {
                            orderId, status, userId
                        } = event;
                        const side = 0;

                        await cancel({orderId, side, status, userId});
                        return {
                            success: true,
                        }
                    }
                    case serviceType_creater.GET: {
                        const {
                            status, userId, _getListRec, limit
                        } = event;

                        const res = await getCreaterOrderList({
                            status, userId, _getListRec, limit
                        })
                        return {
                            orderList: res.orderList,
                            _getListRec: res._getListRec,
                            success: true
                        }
                    }
                    default:
                        throw new Error('invalid service type');
                }
                break;
            case side.SERVER:     // server
                switch(event.serviceType) {
                    case serviceType_server.TAKE: {
                        const {
                            userId, orderId, mobile
                        } = event;
                        await take({userId, orderId, mobile});
                        return {
                            success: true
                        }
                    }
                    case serviceType_server.START: {
                        const {
                            userId, orderId
                        } = event;
                        await start({userId, orderId});
                        return {
                            success: true
                        }
                    }
                }
            default:
                throw new Error("invalid side");
        }
    } catch(e) {
        const code = e.code ? e.code : -1;
        let error = e.error ? e.error : e;
        return {
            success: false,
            code,
            error,
        }
    }
    
};

async function initial(arg) {
    console.log('initial')
    
    const createrId = arg.userId;
    const serverId = null;
    
    const timestamp = Number(new Date());
    let res = await uniCloud.callFunction({
        name: 'createId',
        data: {
            timestamp,
            type: 1,
        }
    });
    const _id = res.result.orderId;
    
    const status = _orderStatus.INITIALING;
    const createTime = Number(new Date());
    res = await activeOrder.add({
        _id,
        createrId,
        serverId,
        status,
        createTime,
        ...arg.order,
    })
    console.log(res);
    return res.id;
}

async function create(arg) {
    
    const {
        orderId
    } = arg;
    
    await activeOrder.doc(orderId).update({
        status: _orderStatus.CREATED,
    })
}

async function evaluate(opt) {
    const {
        side, orderId, score, comment
    } = opt;
    
    let sideField;
    let scoreField;
    let commentField;
    switch(opt.side) {
        case side.CREATER: 
            // sideField = 'hasCreaterComment';
            scoreField = 'createrScore';
            commentField = 'createrComment';
            break;
        case side.SERVER:
            // sideField = 'hasServerComment';
            scoreField = 'serverScore';
            commentField = 'serverComment';
        default:
    }
    await db.runTransaction(async transaction => {
        try {
            const res = await transaction.collection('inactive-order').doc(orderId).get();
            const evalStatus = (res.data)[0].evalStatus;
            if (evalStatus == opt.side) {
                throw new error('already commented');
            } else if (evalStatus == -1) {
                await transaction.collection('inactive-order').doc(orderId).update({
                    evalStatus: opt.side;
                })
            } else {
                await transaction.collection('inactive-order').doc(orderId).update({
                    status: _orderStatus.COMPLETED
                });
            }
            await transaction.collection('order-comment').doc(orderId).update({
                [scoreField]: score,
                [commentField]: comment,
            })
        } catch(e) {
            transaction.rollback({code: -1, error: e});
        }
    })
}

async function cancel(arg) {
    const {
        side, orderId, status,
    } = arg;
    
    switch(status) {
        case _orderStatus.INITIALING:
            await db.runTransaction(async transaction => {
                try {
                    const res = await transaction.collection('active-order').doc(orderId).get();
                    if (res.data.length == 0 || res.data[0].status != _orderStatus.INITIALING) {
                        transaction.rollback({
                            code: -2
                        })
                    }
                    await transaction.collection('active-order').doc(orderId).remove();
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            
            break;
        case _orderStatus.CREATED:
            await db.runTransaction(async transaction => {
                try {
                    let res = await transaction.collection('created-order').doc(orderId).get();
                    if (res.data.length == 0) {
                        transaction.rollback({code: -2});
                    }
                    const order = res.data[0];
                    order.status = _orderStatus.CANCELED;
                    const returnAmount = getTotalCost(order.cost) - order.deposit;
                    await transaction.collection('inactive-order').add(order);
                    await transaction.collection('createdOrder').doc(orderId).remove();
                    await transaction.collection('uni-id-users').doc(order.createrId).update({
                        balance: dbCmd.inc(returnAmount)
                    })
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            break;
        case _orderStatus.ACCEPTED:
            await db.runTransaction(async transaction => {
                try {
                    let res = await transaction.collection('active-order').doc(orderId).get();
                    const order = res.data.length() == 1 ? res.data[0] : null;
                    if (order == null || order.status != _orderStatus.ACCEPTED) {
                        transaction.rollback({code: -2, error: 'already canceled or serving'});
                    }
                    const totalCost = getTotalCost(order.cost);
                    let createrReturn = side == 0 ? totalCost - order.deposit : totalCost + order.deposit;
                    let serverReturn = side == 0 ? 2 * order.deposit : 0;
                    await transaction.collection('uni-id-users').doc(order.createrId).update({
                        balance: dbCmd.inc(createrReturn)
                    });
                    await transaction.collection('uni-id-users').doc(order.serverId).update({
                        balance: dbCmd.inc(serverReturn)
                    })
                    order.cancelSide = side;
                    order.status = _orderStatus.CANCELED;
                    await transaction.collection('inactive-order').add(order);
                    await transaction.collection('active-order').doc(orderId).remove();
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            break;
        case _orderStatus.SERVING:
            await db.runTransaction(async transaction => {
                try {
                    let res = await transaction.collection('active-order').doc(orderId).get();
                    const order = res.data.length() == 1 ? res.data[0] : null;
                    if (order == null || order.status != _orderStatus.SERVING) {
                        transaction.rollback({code: -2, error: 'already completed'});
                    }
                    const cancelSide = side;
                    await transaction.collection('active-order').doc(orderId).update({
                        cancelSide,
                        status: _orderStatus.CANCELING
                    })
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            break;
        default:
    }
    
}

async function getCreaterOrderList(opt) {
    const {
        status, userId, limit
    } = opt;
    const _getListRec = !opt._getListRec || Object.keys(opt._getListRec).length==0 ? 
        {activeSkip: 0, inactiveSkip: 0, acceptedSkip: 0} : opt._getListRec;
    const activeStatus = [];
    const inactiveStatus = [];
    let hasCreated = false;
    
    for (let astatus of status) {
        if (isActiveStatus(astatus)) {
            activeStatus.push(astatus);
        } else if (isInactiveStatus(astatus)) {
            inactiveStatus.push(astatus);
        } else if (astatus == _orderStatus.CREATED) {
            hasCreated = true;
        }
    }
    
    const resList = [];
    
    if (activeStatus.length > 0) {
        let res = await activeOrder.where({
            status: dbCmd.in(activeStatus),
            createrId: userId,
        }).skip(_getListRec.activeSkip).limit(limit).get();
        
        let count = res.data.length;
        if (count > 0) {
            _getListRec.activeSkip = _getListRec.activeSkip + count;
            resList.push(...res.data);
        }
    }
    
    if (hasCreated) {
        let res = await acceptedOrder.where({
            createrId: userId,
        }).skip(_getListRec.createdSkip).limit(limit).get();
        let count = res.data.length;
        if (count > 0) {
            _getListRec.acceptedSkip = _getListRec.acceptedSkip + count;
            resList.push(...res.data);
        }
    }
    if (inactiveStatus.length > 0) {
        let res = await inactiveOrder.where({
            status: dbCmd.in(inactiveStatus),
            createrId: userId,
        }).skip(_getListRec.inactiveSkip).limit(limit).get();
        let count = res.data.length;
        if (count > 0) {
            _getListRec.inactiveSkip = _getListRec.inactiveSkip + count;
            resList.push(...res.data);
        }
    }
    return {
        orderList: resList,
        _getListRec
    }
}

async take(arg) {
    const {
        userId, orderId, mobile
    } = arg;
    await db.runTransaction(async transaction => {
        let res = await transaction.collection('active-order').doc(orderId).get();
        if (res.data.length == 0 || res.data[0].status != _orderStatus.CREATED) {
            transaction.rollback({code: -2});
        }
        await transaction.collection('active-order').doc(orderId).update({
            status: _orderStatus.ACCEPTED,
            serverId: userId,
            serverMobile: mobile,
        })
    })
}

async start(arg) {
    const {
        userId, orderId
    } = arg;
    await db.runTransaction(async transaction => {
        let res = await transaction.collection('active-order').doc(orderId).get();
        if (res.data.length == 0 || ) {
            transaction.rollback({code: -3})
        } else if (res.data[0].serverId != userId) {
            transaction.rollback({code: -2})
        } else if (res.data[0].status != _orderStatus.ACCEPTED) {
            transaction.rollback({code: -3})
        }
        await transaction.collection('active-order').doc(orderId).update({
            status: _orderStatus.SERVING
        });
    })
}
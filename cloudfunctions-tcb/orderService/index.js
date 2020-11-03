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
    FINISH: 3,
    EVALUATE: 4,
    CANCEL: 5,
    GET_CREATED_LIST: 6,
    GET_USER_LIST: 7
}

const _side = {
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
    
    const {
        userId, side, orderId
    } = event;
    
    try {
        switch(side) {
            case _side.CREATER:     // creater
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
                        await create({orderId});
                        return {
                            success: true,
                        }
                    }
                    case serviceType_creater.EVALUATE: {
                        const {
                            score, comment
                        } = event;
                        await evaluate({orderId, side, score, comment});
                        return {
                            success: true,
                        }
                    }
                    case serviceType_creater.CANCEL: {
                        const {
                            status
                        } = event;
                        await cancel({orderId, side, status, userId});
                        return {
                            success: true,
                        }
                    }
                    case serviceType_creater.GET: {
                        const {
                            status, _getListRec, limit, fromStart
                        } = event;

                        const res = await getCreaterOrderList({
                            status, userId, _getListRec, limit, fromStart
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
            case _side.SERVER:     // server
                switch(event.serviceType) {
                    case serviceType_server.TAKE: {
                        const {
                            mobile
                        } = event;
                        await take({userId, orderId, mobile});
                        return {
                            success: true
                        }
                    }
                    case serviceType_server.START: {
                        await start({userId, orderId});
                        return {
                            success: true
                        }
                    }
                    case serviceType_server.FINISH: {
                        const {
                            confirmCode
                        } = event;
                        await finish({userId, orderId, confirmCode});
                        return {
                            success: true
                        }
                    }
                    case serviceType_server.CANCEL: {
                        const {
                            status
                        } = event;
                        await cancel({userId, orderId, side, status});
                        return {
                            success: true
                        }
                    }
                    case serviceType_server.GET_CREATED_LIST: {
                        const {
                            fromStart, _cretedListRec, limit
                        } = event;
                        const res = await getCreatedOrderList({ _createdListRec, limit, fromStart});
                        return {
                            ...res,
                            success: true
                        }
                    },
                    case serviceType_server.GET_USER_LIST: {
                        const {
                            fromStart, _serverListRec, limit, status
                        } = event;
                        const res = await getServerOrderList({status, fromStart, limit, _serverListRec});
                        return {
                            ...res,
                            success: true,
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
    const cancelSide = -1;
    const evalStatus = -1;
    
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
        cancelSide,
        evalStatus,
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
        userId, side, orderId, score, comment
    } = opt;
    
    let sideField;
    let scoreField;
    let commentField;
    let userIdField
    switch(side) {
        case _side.CREATER: 
            scoreField = 'createrScore';
            commentField = 'createrComment';
            userIdField = 'createrId';
            break;
        case _side.SERVER:
            scoreField = 'serverScore';
            commentField = 'serverComment';
            userIdField = 'serverId';
        default:
    }
    await db.runTransaction(async transaction => {
        try {
            const res = await transaction.collection('inactive-order').doc(orderId).get();
            if (res.data.length == 0) {
                transaction.rollback({code: -2});
            } 
            const order = res.data[0];
            if (order[userIdField] != userId) {
                transaction.rollback({code: -3});
            }
            if (order.status != _orderStatus.EVALUATING || order.evalStatus == side) {
                transaction.rollback({code: -2});
            }
            
            await transaction.collection('order-comment').doc(orderId).update({
                [commentField]: comment,
                [scoreField]: score,
            })
            
            if (order.evalStatus == 1 - side) {
                await transaction.collection('inactive-order').doc(orderId).update({
                    status: orderStatus.COMPLETED
                })
            } else {
                // having juded order.evalStatus != side
                await transaction.collection('inactive-order').doc(orderId).update({
                    evalStatus: side
                })
            }
        } catch(e) {
            transaction.rollback({code: -1, error: e});
        }
    })
}

async function cancel(arg) {
    const {
        side, orderId, status, userId
    } = arg;
    
    const userIdField = side == _side.CREATER ? 'createrId' : 'serverId'
    
    switch(status) {
        case _orderStatus.INITIALING: {
            if (side != _side.CREATER) {
                throw new Error({code: -3});
            }
            await db.runTransaction(async transaction => {
                try {
                    const res = await transaction.collection('active-order').doc(orderId).get();
                    if (res.data.length == 0) {
                        transaction.rollback({code: -2});
                    }
                    const order = res.data[0];
                    if (order.createrId != userId) {
                        transaction.rollback({code: -3});
                    }
                    if (order.status != _orderStatus.INITIALING) {
                        transaction.rollback({code: -2});
                    }
                    await transaction.collection('active-order').doc(orderId).remove();
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            return;
        }
        case _orderStatus.CREATED: {
            if (side != _side.CREATER) {
                throw new Error({code: -3})
            }
            await db.runTransaction(async transaction => {
                try {
                    const res = await transaction.collection('created-order').doc(orderId).get();
                    if (res.data.length == 0) {
                        transaction.rollback({code: -2});
                    }
                    const order = res.data[0];
                    order.status = _orderStatus.CANCELED;
                    order.cancelSide = _side.CREATER;
                    const returnAmount = getTotalCost(order.cost);
                    await transaction.collection('inactive-order').add(order);
                    await transaction.collection('created-order').doc(orderId).remove();
                    await transaction.collection('uni-id-users').doc(order.createrId).update({
                        balance: dbCmd.inc(returnAmount)
                    })
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            return;
        }
        case _orderStatus.ACCEPTED: {}
            await db.runTransaction(async transaction => {
                try {
                    const res = await transaction.collection('active-order').doc(orderId).get();
                    const order = res.data.length() == 0 ? null : res.data[0];
                    if (order == null || order.status != _orderStatus.ACCEPTED) {
                        transaction.rollback({code: -2, error: 'already canceled or serving'});
                    }
                    if (order[userIdField] != userId) {
                        transaction.rollback({code: -3});
                    }
                    const totalCost = getTotalCost(order.cost);
                    let createrReturn = side == _side.CREATER ? totalCost - order.deposit : totalCost + order.deposit;
                    let serverReturn = side == _side.CREATER ? 2 * order.deposit : 0;
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
            return;
        }
        case _orderStatus.SERVING: {
            await db.runTransaction(async transaction => {
                try {
                    const res = await transaction.collection('active-order').doc(orderId).get();
                    const order = res.data.length() != 0 ? res.data[0] : null;
                    if (order == null || order.status != _orderStatus.SERVING || order.cancelSide == side) {
                        transaction.rollback({code: -2});
                    }
                    if (order[userIdField] != userId) {
                        transaction.rollback({code: -3});
                    }
                    await transaction.collection('active-order').doc(orderId).update({
                        cancelSide: side,
                        status: _orderStatus.CANCELING
                    })
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            return;
        },
        case _orderStatus.CANCELING: {
            await db.runTransaction(async transaction => {
                try {
                    const res = await transaction.collection('active-order').doc(orderId).get();
                    const order = res.data.length != 0 ? res.data[0] : null;
                    if (order == null || order.status != _orderStatus.CANCELING || order.cancelSide == side) {
                        transaction.rollback({error: -2});
                    } 
                    if (order[userIdField] != userId) {
                        transaction.rollback({error: -3});
                    }
                    const totalCost = getTotalCost(order.cost);
                    let createrReturn = side == _side.CREATER ? totalCost - order.deposit : totalCost + order.deposit;
                    let serverReturn = side == _side.CREATER ? 2 * order.deposit : 0;
                    await transaction.collection('uni-id-users').doc(order.createrId).update({
                        balance: dbCmd.inc(createrReturn)
                    });
                    await transaction.collection('uni-id-users').doc(order.serverId).update({
                        balance: dbCmd.inc(serverReturn)
                    })
                    
                    order.status = CANCELED;
                    await transaction.collection('inactive-order').add(order);
                    await transaction.collection('active-order').doc(orderid).remove();
                } catch(e) {
                    transaction.rollback({code: -1, error: e});
                }
            })
            return;
        }
        default:
            throw new Error({code: -1, error: 'no such status for canceled'})
    }
    
}

async function getCreaterOrderList(opt) {
    const {
        status, userId, limit, fromStart
    } = opt;
    const _getListRec = (fromStart || !opt._getListRec || Object.keys(opt._getListRec).length==0) ? 
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

async function getCreatedOrderList(arg) {
    const {
        limit, fromStart
    } = opt;
    const _createdListRec = (fromStart || !arg._createdListRec || Object.keys(arg._createdListRec).length==0) ? 
        {skip: 0} : arg._createdListRec;

    const resList = [];
    
    const res = await db.collection('created-order').skip(_createdListRec.skip).limit(limit).get();

    _getListRec.skip = _getListRec.skip + res.data.length;
    resList.push(...res.data);

    return {
        orderList: resList,
        _createdListRec,
    }
}

async function getServerOrderList(arg) {
    const {
        limit, fromStart, status
    } = arg;
    
    const _serverListRec = (fromStart || !arg._serverListRec || Object.keys(arg._serverListRec).length==0) ?
        {activeSkip: 0, inactiveSkip: 0} : arg._serverListRec;
    const activeStatus = [];
    const inactiveStatus = [];
    
    for (let astatus of status) {
        if (isActiveStatus(astatus)) {
            activeStatus.push(astatus);
        } else {
            inactiveStatus.push(astatus);
        } 
    }
    
    const resList = [];
    
    if (activeStatus.length > 0) {
        let res = await activeOrder.where({
            status: dbCmd.in(activeStatus),
            serverId: userId,
        }).skip(_serverListRec.activeSkip).limit(limit).get();
        
        _serverListRec.activeSkip += res.data.length;
        resList.push(...res.data);
    }

    if (inactiveStatus.length > 0) {
        let res = await inactiveOrder.where({
            status: dbCmd.in(inactiveStatus),
            serverId: userId,
        }).skip(_serverListRec.inactiveSkip).limit(limit).get();
        _serverListRec.inactiveSkip += res.data.length;
        resList.push(...res.data);
    }
    return {
        orderList: resList,
        _serverListRec
    }
    
}



async function take(arg) {

    const {
        userId, orderId, mobile
    } = arg;
    await db.runTransaction(async transaction => {
        try {
            const res = await transaction.collection('created-order').doc(orderId).get();
            const order = res.data.length != 0 : res.data[0] : null;
            if (order == null || order.status != _orderStatus.CREATED) {
                transaction.rollback({code: -2});
            }
            order.status = _orderStatus.ACCEPTED;
            order.serverId = userId;
            order.serverMobile = mobile;
            await transaction.collection('active-order').add(order);
            await transaction.collection('created-order').doc(orderId).remove();
        } catch(e) {
            transaction.rollback({code: -1, error: e});
        }
    })

}



async function start(arg) {
    const {
        userId, orderId
    } = arg;
    const confirmCode = getRandomCode();
    const errCodeCount = 5;
    await db.runTransaction(async transaction => {
        
        try {
            const res = await transaction.collection('active-order').doc(orderId).get();
            if (res.data.length == 0 || ) {
                transaction.rollback({code: -3})
            } 
            const order = res.data[0];
            if (order.serverId != userId) {
                transaction.rollback({code: -2})
            }
            if (order.status != _orderStatus.ACCEPTED) {
                transaction.rollback({code: -3})
            }
            await transaction.collection('active-order').doc(orderId).update({
                status: _orderStatus.SERVING,
                confirmCode,
                errCodeCount,
            });
        } catch(e) {
            transaction.rollback({code: -1, error: e});
        }
    })
}

async function finish(arg) {
    const {
        userId, orderId, confirmCode
    } = arg;
    await db.runTransaction(async transaction => {
        try {
            let order;
            const res = await transaction.collection('active-order').doc(orderId).get();
            if (res.data.length == 0) {
                transaction.rollback({code: -3});
            } else if ((order = res.data[0]).serverId != userId) {
                transaction.rollback({code: -2});
            } else if (order.status != _orderStatus.SERVING) {
                transaction.rollback({code: -3});
            } else if (order.errCodeCount <= 0) {
                transaction.rollback({code: -5})
            } else if (order.confirmCode != confirmCode) {
                transaction.collection('active-order').doc(orderId).update({
                    codeErrCount: dbCmd.inc(-1);
                })
                transaction.rollback({code: -4, error: {errCodeCount: order.errCodeCount-1}})
            }
            order.orderStatus = _orderStatus.EVALUATING;
            order.evalStatus = -1;
            const orderComment = {
                _id: orderId,
                serverScore: null,
                serverComment: null,
                createrScore: null,
                createrComment: null,
            }
            const total = getTotalCost(order.cost) + order.deposit;
            await transaction.collection('uni-id-users').doc(order.serverId).update({
                balance: dbCmd.inc(total)
            });
            await transaction.collection('order-comment').add(orderComment);
            await transaction.collection('inactive-order').add(order);
            await transaction.collection('active-roder').doc(orderId).remove();
        } catch (e) {
            transaction.rollback({code: -1, error: e})
        }
        
    })
    
}

function getRandomLetter() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return characters[Math.floor(Math.random() * 36)];
}

function getRandomCode() {
    const array = [];
    for (let i = 0; i < 6; i++) {
        array.push(getRandomLetter());
    }
    return array.join('');
}
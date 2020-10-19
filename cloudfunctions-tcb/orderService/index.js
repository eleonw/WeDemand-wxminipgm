'use strict';
const db = uniCloud.database();
const activeOrder = db.collection('active-order');
const inactiveOrder = db.collection('inactive-order');
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

const serviceType_creater = {
    INITIAL: 1,
    CREATE: 2,
    EVALUATE: 3,
    CANCEL: 4,
}

const side = {
    CREATER: 0,
    SERVER: 1,
}

function getDeposit(cost) {
 
    res = Math.ceil((cost * 10) * depositRate) / 10
}

function getTotalCost(cost) {
    let res = 0;
    for (item in cost) {
        res += cost[item];
    }
}

exports.main = async (event) => {
    
    const userId = event.userId;
    
    try {
        switch(event.side) {
            case side.CREATER:     // creater
                switch(event.serviceType) {
                    case serviceType_creater.INITIAL:  {// initial
                        let 
                        const order = event.order;
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
                    case serviceType_creater.CREATE: 
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
                    },
                    case serviceType_creater.CANCEL: {
                        const {
                            orderId, status, userId
                        } = event;
                        const side = 0;

                        await cancel({orderId, side, status, userId});
                        return {
                            success: true,
                        }
                        
                    },
                    default:
                        throw new Error('invalid service type');
                }
            case side.SERVER:     // server
        
                break;
            default:
                throw new Error("invalid side");
        }
    } catch(e) {
        code = e.code ? e.code : -1;
        let error = e.error ? e.error : e;
        return {
            success: false,
            code,
            error,
        }
    }
    
};


async function initial(arg) {
    
    const createrId = arg.userId;
    const serverId = null;
    
    const _id = (await uniCloud.callFunction({
        name: 'createId',
        data: {
            timestamp: Number(new Date()),
            type: 1,
        }
    })).result;
    
    const status = _orderStatus.INITIALING;
    const timestamp = Number(new Date());
    
    const res = await activeOrder.add({
        _id,
        createrId,
        serverId,
        status,
        timestamp,
        ...arg.order,
    })
    
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
            sideField = 'hasCreaterComment';
            scoreField = 'createrScore';
            commentField = 'createrComment';
            break;
        case side.SERVER:
            sideField = 'hasServerComment';
            scoreField = 'serverScore';
            commentField = 'serverComment';
        default:
    }
    await db.runTransaction(async transaction => {
        try {
            await transaction.collection('inactive-order').doc(orderId).update({
                [sideField]: true
            })
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
            await inactiveOrder.doc(orderId).remove();
            break;
        case _orderStatus.CREATED:
            await db.runTransaction(async transaction => {
                try {
                    await res = transaction.collection('activeOrder').doc(orderId).get();
                    const order = res.data[0];
                    if (order.status != _orderStatus.CREATED) {
                        transaction.rollback({code: -2, error: 'already accepted'})
                    }
                    const returnAmount = getTotalCost(order.cost) - order.deposit;
                    await transaction.collection('activeOrder').doc(orderid).update({
                        status: _orderStatus.CALCELED,
                    })
                    await transaction.collection('uni-id-users').doc(order.createrId).update({
                        balance: dbCmd.inc(returnAmount);
                    })
                }
            })
            break;
        case _orderStatus.ACCEPTED:
            await db.runTransaction(async transaction => {
                try {
                    await res = transaction.collection('activeOrder').doc(orderId).get();
                    const order = res.data.length() == 1 ? res.data[0] : null;
                    if (order == null || order.status != _orderStatus.ACCEPTED) {
                        transaction.rollback({code: -2, error: 'already canceled or serving'});
                    }
                    const totalCost = getTotalCost(order.cost);
                    let createrReturn = side == 0 ? totalCost - order.deposit : totalCost + order.deposit;
                    let serverReturn = side == 0 ? 2 * order.deposit : 0;
                    await transaction.collection('uni-id-users').doc(order.createrId).update({
                        balance: dbCmd.inc(createrReturn);
                    });
                    await transaction.collection('uni-id-users').doc(order.serverId).update({
                        balance: dbCmd.inc(serverReturn);
                    })
                    order.cancelSide = side;
                    order.status = _orderStatus.CANCELED;
                    await transaction.collection('inactiveOrder').add(order);
                    await transaction.collection('activeOrder').remove();
                }
            })
            break;
        case _orderStatus.SERVING:
            await db.runTransaction(async transaction => {
                try {
                    await res = transaction.collection('activeOrder').doc(orderId).get();
                    const order = res.data.length() == 1 ? res.data[0] : null;
                    if (order == null || order.status != _orderStatus.SERVING) {
                        transaction.rollback({code: -2, error: 'already completed'});
                    }
                    const cancelSide = side;
                    await transaction.collection('activeOrder').doc(orderId).update({
                        cancelSide,
                        status: _orderStatus.CANCELING;
                    })
                }
            })
            break;
        default:
    }
    
    db.runTransaction(async transaction => {
        try {
            transaction.collection('')
        }
    })
    
    switch(side) {
        
    }
    
}
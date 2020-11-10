'use strict';
const db = uniCloud.database();
const activeOrder = db.collection('active-order');
const inactiveOrder = db.collection('inactive-order');
const createdOrder = db.collection('created-order');
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
    TEMP: -100
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

let resPoint = 'nothing';

exports.main = async (event) => {
  
    const { userId, side, orderId } = event;
    try {
      switch(side) {
            case _side.CREATER: {     // creater
              switch(event.serviceType) {
                case serviceType_creater.INITIAL:  {// initial
                  return await initial(event);
                }
                case serviceType_creater.CREATE: {
                  return await create(event);
                }
                case serviceType_creater.EVALUATE: {
                  const { score, comment } = event;
                  await evaluate({orderId, side, score, comment});
                  return { success: true }
                }
                case serviceType_creater.CANCEL: {
                  const { status } = event;
                  await cancel({orderId, side, status, userId});
                  return { success: true };
                }
                case serviceType_creater.GET: {
                  const { status, _getListRec, limit, fromStart } = event;
                  const res = await getCreaterOrderList({ status, userId, _getListRec, limit, fromStart });
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
            }
            case _side.SERVER:     // server
              switch(event.serviceType) {
                case serviceType_server.TAKE: {
                  const { mobile } = event;
                  return await take({userId, orderId, mobile});
                }
                case serviceType_server.START: {
                    return await start({userId, orderId});
                }
                case serviceType_server.FINISH: {
                  console.log('1')
                  const { confirmCode } = event;
                  return await finish({userId, orderId, confirmCode});
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
                  const { fromStart, _createdListRec, limit } = event;
                  return await getCreatedOrderList({ _createdListRec, limit, fromStart});
                }
                case serviceType_server.GET_USER_LIST: {
                    const { fromStart, _serverListRec, limit, status, userId } = event;
                    return await getServerOrderList({status, fromStart, limit, _serverListRec});
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
            e,
            resPoint
        }
    }
    
};

async function initial(arg) {
  const depositRate = 0.25;
  
    const order = arg.order;
    order.deposit = Math.ceil(order.totalCost*depositRate);
    order.createrId = arg.userId;
    order.serverId = null;
    order.cancelSide = -1;
    order.evalStatus = -1;
    
    let res = await uniCloud.callFunction({
        name: 'createId',
        data: { type: 1 },
    });
    order._id = res.result.orderId;
    
    order.status = _orderStatus.INITIALING;
    order.createTime = Number(new Date());

    res = await activeOrder.add(order);
    return {
      success: true,
      orderId: order._id,
      order
    }
}

async function create(arg) {
    
    const { orderId } = arg;
    const res = await activeOrder.doc(orderId).get();
    const order = res.data[0];
    order.status = _orderStatus.CREATED;
    await createdOrder.add(order);
    await activeOrder.doc(orderId).remove();
    return {success: true};
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
                    const returnAmount = order.totalCost;
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
        case _orderStatus.ACCEPTED: 
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
                    const totalCost = order.totalCost;
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
        }
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
                    const totalCost = order.totalCost;
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
        {activeSkip: 0, inactiveSkip: 0, createdSkip: 0} : opt._getListRec;
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
        let res = await createdOrder.where({ createrId: userId }).skip(_getListRec.createdSkip).limit(limit).get();
        let count = res.data.length;
        if (count > 0) {
            _getListRec.createdSkip = _getListRec.createdSkip + count;
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

async function getCreatedOrderList(opt) {
    const { limit, fromStart } = opt;
    const _createdListRec = (fromStart || !opt._createdListRec || Object.keys(opt._createdListRec).length==0) ? 
        {skip: 0} : opt._createdListRec;
    const resList = [];
    const res = await db.collection('created-order').skip(_createdListRec.skip).limit(limit).get();
    _createdListRec.skip = _createdListRec.skip + res.data.length;
    resList.push(...res.data);
    return {
        orderList: resList,
        _createdListRec,
        success: true,
    }
}

async function getServerOrderList(arg) {
    const { limit, fromStart, status, userId } = arg;
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
    console.log('2')

    if (inactiveStatus.length > 0) {
        let res = await inactiveOrder.where({
            status: dbCmd.in(inactiveStatus),
            serverId: userId,
        }).skip(_serverListRec.inactiveSkip).limit(limit).get();
        _serverListRec.inactiveSkip += res.data.length;
        resList.push(...res.data);
    }
    console.log('3')
    return {
        orderList: resList,
        _serverListRec,
        success: true,
    }
    
}

async function take(arg) {

    const {
        userId, orderId, mobile
    } = arg;
    
    let res = await createdOrder.doc(orderId).get();
    const order = res.data.length == 0 ? null : res.data[0];
    if (order == null) {return {success: false, code: -2}};
    order.status = _orderStatus.ACCEPTED;
    order.serverId = userId;
    order.serverMobile = mobile;
    return await db.runTransaction(async transaction => {
        try {
            await transaction.collection('active-order').add(order);
            await transaction.collection('created-order').doc(orderId).remove();
            return {success: true}
        } catch(e) {
            transaction.rollback({success: false, error: e, code: -1});
        }
    })
}

async function start(arg) {
    const { userId, orderId } = arg;
    const confirmCode = getRandomCode();
    const errCodeCount = 5;
    let res = await activeOrder.doc(orderId).get();
    const order = res.data.length == 0 ? null : res.data[0];
    if (order == null) { return {success: false, code: -3}};
    if (order.serverId != userId) {return {sucess: false, code: -2}};
    if (order.status != _orderStatus.ACCEPTED) {return {success: false, code: -3}}
    res = await activeOrder.doc(orderId).update({
      status: _orderStatus.SERVING,
      confirmCode, errCodeCount
    })
    if (res.updated == 0) {return {success: false, code: -1}};
    return {success: true}
}

async function finish(arg) {
  const { userId, orderId, confirmCode } = arg;
  let res = await activeOrder.doc(orderId).get();
  const order = res.data.length == 0 ? null : res.data[0];
  if (order == null) { return {success: false, code: -3}};
  if (order.serverId != userId) {return {sucess: false, code: -2}};
  if (order.status != _orderStatus.SERVING) {return {success: false, code: -3}}
  if (order.errCodeCount <= 0) {
    order.status = _orderStatus.EXCEPTION;
    await activeOrder.doc(orderId).update({status: _orderStatus.EXCEPTION});
    return {success: false, code: -5};
  }
  if (confirmCode.toUpperCase() != order.confirmCode) {
    const status = order.errCodeCount == 1 ? _orderStatus.EXCEPTION : _orderStatus.SERVING;
    await activeOrder.doc(orderId).update({errCodeCount: dbCmd.inc(-1), status});
    return {success: false, code: -4, errCodeCount: order.errCodeCount-1}
  }
  order.status = _orderStatus.TEMP;
  order.evalStatus = -1;
  
  const serverPay = order.totalCost + order.deposit;
  let returnRes;

  await inactiveOrder.add(order);
  res = await db.runTransaction(async transaction => {
    try {
      await inactiveOrder.doc(orderId).update({status: _orderStatus.EVALUATING});
      await transaction.collection('active-order').doc(orderId).remove();
      await transaction.collection('balance').doc(userId).update({balance: serverPay});
      return {success: true}
    } catch(e) {
      transaction.rollback({success: false, error: e})
    }
  }, 10)
  
  if (res.success) { 
    returnRes = {success: true, pay: order.totalCost, depositBack: order.deposit}
    const comment = {
        _id: orderId,
        serverScore: null,
        serverComment: null,
        createrScore: null,
        createrComment: null,
    }
    try {
      res = await orderComment.add(comment);
      returnRes.createComment = true;
    } catch(e) {
      returnRes.createComment = false;
    }
  } else {
    await inactiveOrder.doc(orderId).remove();
    returnRes = {success: false, code: -1, error: res.error}
  }
    
  return returnRes;
}

function getRandomLetter() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
    return characters[Math.floor(Math.random() * 34)];
}

function getRandomCode() {
    const array = [];
    for (let i = 0; i < 6; i++) {
        array.push(getRandomLetter());
    }
    return array.join('');
}
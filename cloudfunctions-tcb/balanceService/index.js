'use strict';
const db = uniCloud.database();
const balanceTable = db.collection('balance');

const uniID = require('uni-id');

const ServiceType = {
    CHECK: 1,
    PAY: 2,
    RECHARGE: 3,
}

exports.main = async (event, context) => {
    
    try {
        const res = await uniID.checkToken(event.uniIdToken);
        if (res.code != 0 || res.uid != event.userId) {
            return {
                success: false,
                code: -2,
                res,
                event
            }
        }
        switch(event.serviceType) {
            case ServiceType.CHECK:
                return await checkBalance(event);
            case ServiceType.PAY:
                return await payWithBalance(event);
            case ServiceType.RECHARGE:
                return await rechargeBalance(event);
            default:
                throw new Error('invalid service type')
        }
    } catch(e) {
        return {
            success: false,
            code: -1,
            error: e,
            event,
        }
    }
	
};

async function rechargeBalance(arg) {
  const {
    userId, amount
  } = arg;
  if (amount < 0) return { success: false, code: -4 };
  let res = await balanceTable.doc(userId).get();
  const balance = res.data[0].balance;
  const newBalance = balance + amount;
  res = await balanceTable.doc(userId).update({
      balance: newBalance
  })
  if (res.updated == 0) {
      return{success: false, code: -1, balance: balance};
  }
  return {success: true, balance: newBalance};
}

async function checkBalance(arg) {
    const {
        userId
    } = arg;
    let res = await balanceTable.doc(userId).get();
    return {
        success: true,
        balance: res.data[0].balance 
    }
}

async function payWithBalance(arg) {
    const {
        userId, amount
    } = arg;
    if (amount < 0) {
        return { success: false, code: -4 };
    }
    
    let res = await balanceTable.doc(userId).get();
    const balance = res.data[0].balance;
    if (balance < amount) {
        return { success: false, code: -3, balance: balance };
    }
    const newBalance = balance - Math.floor(amount);
    res = await balanceTable.doc(userId).update({
        balance: newBalance
    })
    if (res.updated == 0) {
        return{success: false, code: -1, balance: balance};
    }
    return {success: true, balance: newBalance};
    
}

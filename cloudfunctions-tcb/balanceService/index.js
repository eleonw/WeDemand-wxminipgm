'use strict';
const db = uniCloud.database();
const balanceTable = db.collection('balance');

uniID = require('uni-id');

const ServiceType = {
    CHECK: 1,
    PAY: 2,
}

exports.main = async (event, context) => {
	
    try {
        const res = await uniID.checkToken(event.uniIdToken);
        if (res.code != 0 || res.uid != event.userId) {
            return {
                success: false,
                code: -2
            }
        }
        
        switch(event.serviceType) {
            case ServiceType.CHECK:
                return await checkBalance(event);
            case serviceType.PAY:
                return await payWithBalance(event);
            default:
                throw new Error('invalid service type')
        }
    } catch(e) {
        return {
            success: false,
            code: -1,
            error: e;
        }
    }
	
};

async checkBalance(arg) {
    const {
        userId
    } = arg;
    let res = await balanceTable.doc(userId).get();
    return {
        success: true,
        balance: res.data[0].balance 
    }
}

async payWithBalance(arg) {
    const {
        userId, amount
    } = arg;

    if (amount < 0) {
        return { success: false, code: -4 };
    }
    

    
    await res = await balanceTable.doc(userId).get();
    const balance = res.data[0].balance;
    if (balance < amount) {
        return { success: false, code: -3, balance: balance };
    }
    const newBalance = balance - Math.floor(amount);
    await res = await balanceTable.doc(userId).update({
        balance: newBalance
    })
    if (res.updated == 0) {
        return{success: false, code: -1, balance: balance};
    }
    return {success: true, balance: newBalance};
    
}
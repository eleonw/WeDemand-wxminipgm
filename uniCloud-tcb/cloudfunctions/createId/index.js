'use strict';
const db = uniCloud.database();
const cmd = db.command;

const DAY_TIME = 1000 * 60 * 60 * 24;

const ORDER_PREFIX = '001';

function formatNumber(opt) {
    let numberString = opt.value.toString();
    if (numberString.length > opt.strLength) {
        throw new Error('value exceed')
    } else {
        let boundary = opt.strLength - numberString.length;
        while (boundary) {
            numberString = '0' + numberString;
            boundary--;
        }
        return numberString;
    }
}

/**
 * @param {event.time}
 * the time(miliseconds since 1970/1/1) for the day's begining
 */
let timestamp;
let idCount;

exports.main = async (event) => {
	
    timestamp = Number(new Date());
    timestamp = timestamp - timestamp%DAY_TIME;
    try {
        idCount = await db.runTransaction(getIdCount, 5);
    } catch(e) {
        return {
            success: false,
            error: e,
        }
    }
    
    switch(event.type) {
        case 1: // order
            return {
                success: true,
                orderId: createOrderId()
            }
        default:
            return {
                success: false,
                error: new Error('unkown type: ' + event.type)
            }
    }
    
};

async function getIdCount(transaction) {
    let result = await transaction.collection('id-count').doc(timestamp).get();
    console.log(result)
    if (result.data) {
        try {
            let res = await transaction.collection('id-count').doc(timestamp).update({
                count: cmd.inc(1)
            })
            if (res.updated != 1) {
                throw new Error('a');
            }
        } catch(e) {
            await transaction.rollback(e);
        }
        return result.data.count;
    } else {
        await transaction.rollback(result);
    }
    
}

function createOrderId() {

    const date = new Date(timestamp);
    const dateString = formatNumber({
        value: Number(date),
        strLength: 14,
    })
    
    const value = (idCount + (date.getDate()+date.getMonth())*date.getFullYear()) % 100000000; 
    idCount = formatNumber({value, strLength: 8})
    
    return ORDER_PREFIX + dateString.substring(-3) + dateString.substring(0, -3) + idCount;
}
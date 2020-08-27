'use strict';
const db = uniCloud.database();
const cmd = db.command;

const DAY_TIME = 1000 * 60 * 60 * 24;

/**
 * @param {event.time}
 * the time(miliseconds since 1970/1/1) for the day's begining
 */
let time;

exports.main = async (event) => {
	
    time = Number(event.time)
    time = time - time%DAY_TIME;
    
    let idCount;
    try {
        idCount = await db.runTransaction(getIdCount, 5);
        
    } catch(e) {
        return {
            success: false,
            error: e,
        }
    }
    
    return {
        idCount,
        success: true,
    }
    
};

async function getIdCount(transaction) {
    
    let result = await transaction.collection('id-count').doc(time).get();
    console.log(result)
    if (result.data) {
        try {
            let res = await transaction.collection('id-count').doc(time).update({
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
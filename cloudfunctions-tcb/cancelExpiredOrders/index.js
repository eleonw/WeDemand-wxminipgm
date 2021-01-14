const db = uniCloud.database()
const dbCmd = db.command
const inactiveOrder = db.collection('inactive-order');
const createdOrder = db.collection('created-order');
const balance = db.collection('balance');

const gapTime = 1000 * 60 * 4;

'use strict';
exports.main = async (event, context) => {
  
  const now = Number(new Date())
  const limit = now + gapTime;
  
  while (true) {
    let res = await createdOrder.where({
      status: 1,
      expireTime: dbCmd.lte(limit)
    }).limit(5).get()
    
    if (res.data.length == 0) {
      break;
    }
    
    res.data.map(async(order) => {
      order.status = -2;
      await db.runTransaction(async transaction => {
        try {
          await balance.doc(order.createrId).update({balance: dbCmd.inc(order.totalCost)})
          await createdOrder.doc(order._id).remove()
          await inactiveOrder.add(order)
        } catch(e) {
          console.log(e)
          transaction.rollback();
        }
      })
    });
  }
  
  
};

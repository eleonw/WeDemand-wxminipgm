const db = uniCloud.database()
const dbCmd = db.command
const activeOrder = db.collection('active-order');
const inactiveOrder = db.collection('inactive-order');
const balance = db.collection('balance');

const gapTime = 1000 * 60 * 4;

'use strict';
exports.main = async (event, context) => {
  
  const now = Number(new Date())
  const limit = now + gapTime;
  
  let res = await activeOrder.where({
    status: 1,
    expireTime: dbCmd.lte(limit)
  }).get()
  
  for (let order of res.data) {
    order.status = -2;
    await db.runTransaction(async transaction => {
      try {
        await balance.doc(order.createrId).update({balance: dbCmd.inc(order.totalCost)})
        await activeOrder.doc(order._id).remove()
        await inactiveOrder.add(order)
      } catch(e) {
        console.log(e)
        transaction.rollback();
      }
    })
  }
  
};

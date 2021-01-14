'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
  
  await clearCollection('active-order');
  await clearCollection('addressbook-rec');
  await clearCollection('balance');
  await clearCollection('created-order');
  await clearCollection('inactive-order');
  await clearCollection('order-comment');
  await clearCollection('uni-id-users');
  await clearCollection('uni-verify');
  
	console.log('event : ', event)
	
	//返回数据给客户端
	return event
};


async function clearCollection(collectionName) {
  let collection = db.collection(collectionName);
  let res = await collection.get()
  res.data.map(async(document) => {
    await collection.doc(document._id).remove();
  });
}
'use strict';
const db = uniCloud.database();
const balance = db.collection('balance');

exports.main = async (event, context) => {
	//event为客户端上传的参数
	balance.doc(event.userId).update({balance: event.newBalance});
	
	//返回数据给客户端
	return event
};

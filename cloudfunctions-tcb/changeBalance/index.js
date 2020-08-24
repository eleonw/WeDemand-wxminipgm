'use strict';

const db = uniCloud.database();
const user = db.collection('user');

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
    user.
	//返回数据给客户端
	return event
};

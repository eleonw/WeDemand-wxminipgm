'use strict';

const uniVerify = uniCloud.database().collection('uni-verify');

exports.main = async (event, context) => {
	//event为客户端上传的参数
	await uniVerify.doc(event.recId).update({
        state: 0,
    })
	
	//返回数据给客户端
};

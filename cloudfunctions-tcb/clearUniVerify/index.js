'use strict';

const db = uniCloud.database();
const uniVerify = db.collection('uni-verify');

exports.main = async (event, context) => {
	//event为客户端上传的参数

  while (true) {
    let res = await uniVerify.where({state: 1}).limit(10).get();
    if (res.data.length == 0) {
      break;
    }
    res.data.map(async(document) => {
      await uniVerify.doc(document._id).remove();
    });
  }
  
	
	//返回数据给客户端
	return event
};

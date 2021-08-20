'use strict';
const db = uniCloud.database();
const user = db.collection('uni-id-users');
const balance = db.collection('balance');

exports.main = async (event, context) => {
	
    const info = {};
    let res = await user.where({mobile: event.mobile}).get();
    const userId = res.data[0]['_id'];
    info.userInfo = res.data;
    
    res = await balance.doc(userId).get();
    info.balanceInfo = res.data;
    return info;
};

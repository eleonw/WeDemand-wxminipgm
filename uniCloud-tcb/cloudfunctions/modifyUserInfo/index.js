'use strict';
const userTab = uniCloud.database().collection('uni-id-users');

exports.main = async (event, context) => {
  
  const { userId, update } = event;
	try {
     let res = await userTab.doc(userId).update(update);
     return {success: true};
  } catch(e) {
    return {success: false, error: e};
  }

};

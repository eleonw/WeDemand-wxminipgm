'use strict';
const userTab = uniCloud.database().collection('uni-id-users');

exports.main = async (event, context) => {
  
	try {
     await userTab.doc(event.userId).update(event.update);
     return {success: true};
  } catch(e) {
    return {success: false, error: e};
  }

};

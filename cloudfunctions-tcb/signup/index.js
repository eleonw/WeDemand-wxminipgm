'use strict';

const db = uniCloud.database();
const users = db.collection('users');

exports.main = async (event, context) => {
  console.log('event : ' + event)
  
  

  return event
};

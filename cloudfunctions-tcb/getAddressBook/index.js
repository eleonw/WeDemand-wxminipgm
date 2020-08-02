'use strict';
const addressBookRec = uniCloud.database().collection('addressBookRec');

exports.main = async (event, context) => {
    
    const res = await addressBookRec
        .where({user_id: event.user_id})
        .field({'_id': true, 'address': true})
        .get()
    
    return res.data;
};

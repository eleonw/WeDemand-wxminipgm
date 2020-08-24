'use strict';
const db = uniCloud.database();
const addressBookRec = db.collection('addressBookRec');
const push = db.command.push;

const maxRecNum = 10;


exports.main = async (event, context) => {
    
    console.log(event)

    switch (event.type) {
        case 0:
            return createRec(event.userId, event.address);
        case 1:
            return updateRec(event.recId, event.address);
        case 2:
            return deleteRec(event.recId);
        case 3:
            return retriveRec(event.userId);
        default:
            throw new Error('invalide type');
    }
    
};


async function createRec(userId, address) {
    
    const number = await addressBookRec.where({user_id: userId}).count();
    if (number >= maxRecNum) {
        throw new Error({exceedMaxNum: true})
    }
    
    const id = (await addressBookRec.add({
        user_id: userId,
        address: address,
    })).id;
    
    return {
        id: id
    }
}

async function retriveRec(userId) {
    const res = await addressBookRec
        .where({user_id: userId})
        .field({'_id': true, 'address': true})
        .get()
    
    return res.data;
}

async function updateRec(recId, address) {

    const res = await addressBookRec.doc(recId).update({
        address: address
    });
    console.log(res);
}


async function deleteRec(recId) {
    
    const res = await addressBookRec.doc(recId).remove();
    if (res.deleted < 1) {
        throw new Error('addressBookRec remove failed');
    }

}
'use strict';
const db = uniCloud.database();
const addressBookRec = db.collection('addressBookRec');
const push = db.command.push;

const maxRecNum = 10;


exports.main = async (event, context) => {
    
    console.log(event)

    switch (event.type) {
        case 0:
            return addRec(event.userId, event.address);
        case 1:
            return updateRec(event.recId, event.address);
        case 2:
            return removeRec(event.recId);
        default:
            throw new Error('invalide type');
    }
    
};


async function addRec(userId, address) {
    
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

async function updateRec(recId, address) {

    const res = await addressBookRec.doc(recId).update({
        address: address
    });
    console.log(res);
}


async function removeRec(recId) {
    
    const res = await addressBookRec.doc(recId).remove();
    if (res.deleted < 1) {
        throw new Error('addressBookRec remove failed');
    }

}
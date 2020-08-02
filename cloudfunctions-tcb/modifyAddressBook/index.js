'use strict';
const db = uniCloud.database();
const addressBookRec = db.collection('addressBookRec');
const push = db.command.push;

const maxRecNum = 10;


exports.main = async (event, context) => {

    switch (event.type) {
        case 0:
            return addRec(event.userId, event.address);
        case 1:
            return updateRec(event.recId, event.address);
        case 3:
            return deleteRec(event.recId);
        default:
            throw new Error('invalide type');
    }
    
};

async function updateRec(recId, address) {

    const res = await addressBookRec.doc(recId).update({
        address: address
    });
    console.log(res);
}

async function addRec(userId, address) {
    
    const number = await addressBookRec.where({user_id: userId}).count();
    if (number >= maxRecNum) {
        throw new Error({exceedMaxNum: true})
    }
    
    const id = (await addressBookRec.add({
        data: {
            user_id: userId,
            address: address,
        }
    })).id;
    
    return {
        id: id
    }
}

async function deleteRec(recId) {
    
    await addressBookrec.doc(recId).remove();

}
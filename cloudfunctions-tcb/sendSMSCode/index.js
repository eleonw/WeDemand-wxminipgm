'use strict';

const uniID = require('uni-id')

exports.main = async (event, context) => {
    
    const {
        mobile,
        type
    } = event;
    
    const code = getRandomCode();
    
    const res = await uniID.sendSmsCode({
        mobile,
        type,
        code,
    })
    return res;
};

function getRandomLetter() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return characters[Math.floor(Math.random() * 36)];
}

function getRandomCode() {
    const array = [];
    for (let i = 0; i < 4; i++) {
        array.push(getRandomLetter());
    }
    return array.join('');
}
'use strict';

const uniID = require('uni-id')

const templateId = '10301';
const expMinute = 10;
const smsKey = '22736e835f44a6941ef9ae64e0668192';
const smsSecret = '7b32b2d4047832e7fba0c30aa4a00efa';

exports.main = async (event, context) => {
    
    const {
        mobile,
        type
    } = event;
    
    const phone = mobile;
    
    const code = getRandomCode();
    
    let res = await uniCloud.sendSms({
        smsKey,
        smsSecret,
        phone,
        templateId,
        data: {
            code,
            action: '登录',
            expMinute
        }
    })
    
    if (res.errCode != 0) {
        return {
            success: false,
            code: -2,
            error: res.errMsg,
        }
    }
   
    res = await uniID.setVerifyCode({
        mobile,
        code,
        expiresIn: expMinute * 60,
        type: 'login'
    })
    
    if (res.code != 0) {
        return {
            success: false,
            code: -3,
            error: res.message
        }
    } else {
        return {
            success: true,
        }
    }
   
};

function getRandomLetter() {
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    return characters[Math.floor(Math.random() * 34)];
}

function getRandomCode() {
    const array = [];
    for (let i = 0; i < 4; i++) {
        array.push(getRandomLetter());
    }
    return array.join('');
}
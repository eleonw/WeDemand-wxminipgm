'use strict';

const uniID = require('uni-id');

function randomLetter() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return letters[Math.floor(Math.random() * 26)];
}

function randomNumber() {
    const numbers = '1234567890';
    return numbers[Math.floor(Math.random() * 10)];
}

function generateNickname() {
    const array = [];
    for (let i = 0; i < 3; i++) {
        array.push(randomLetter());
    }
    for (let i = 0; i < 5; i++) {
        array.push(randomNumber());
    }
    array[0] = array[0].toUpperCase();
    return array.join('');
}

exports.main = async (event, context) => {

    let userInfo;

    switch (event.type) {
        case 'sms': // smsCode
            const {
                mobile,
                code
            } = event;
            
            let res = await uniID.loginBySms({
                mobile,
                code
            });
            
            if (res.code != 0) {
                return {
                    success: false,
                    notice: res,
                }
            }
            res = await uniID.checkToken(res.token);
            if (res.code != 0) {
                return {
                    success: false,
                    notice: res,
                }
            }
            
            return {
                success: true,
                userInfo: res.userInfo
            }
            
            break;

        case 1: // wx
            userInfo = await loginWithWxCode(event.wxCode);
            break;
        default: 
            throw new Error('no valid login material');
   
    }
    
    return {
        userInfo: userInfo
    }
};

async function loginWithWxCode(code) {
    const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa90a21c9fbeeacc2&secret=e99cbe2b47ba8ff484f453e6a0c488b4&js_code=' + code + '&grant_type=authorization_code'

    let wechatInfo = await new Promise((resolve, reject) => {
        request(url, (err, resp, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        })
    })
    const openid = JSON.parse(wechatInfo).openid;
    
    const res = await user.where({
        wx_openid: openid
    }).get();
    
    if (res.data.length != 0) {
        console.log(res);
        return res.data[0];
    } else {
        return await signup({
            wx_openid: openid
        })
    }

}

async function loginBySms(opt) {
    const res = await uniID.loginBySms({
        mobile: opt.mobile,
        code: opt.code,
    });
    return res;
}

async function register(opt) {
    const res = await uniID.register({
        username: opt.tel,
        password: opt.password,
    });
    
}






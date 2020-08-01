'use strict';

const request = require('request');
const db = uniCloud.database();
const user = db.collection('user');

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
    //event为客户端上传的参数
    console.log('event : ' + event)
    //返回数据给客户端

    let userInfo;

    if (event.wxCode) {
      userInfo = await loginWithWxCode(event.wxCode);
    } else if (event.tel) {
      userInfo = await loginWithTel(event.tel);
    } else {
      console.log('no valid login material');
      throw new Error('no valid login material');
    }
    return userInfo;
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

async function loginWithTel(tel) {
    const res = await user.where({
        tel: tel
    }).get();
    
    console.log(res);
    
    if (res.data.length != 0) {
        return res.data[0];
    } else {
        return await signup({
            tel: tel
        })
    }
    
}

async function signup(userInfo) {
    if (!userInfo.nickname) {
        userInfo.nickname = generateNickname();
    }
    let res = await user.add(userInfo);
    userInfo._id = res.id;
    return userInfo;
}






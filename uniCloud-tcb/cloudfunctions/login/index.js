'use strict';

const uniID = require('uni-id');
const db = uniCloud.database();

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

const LoginMethod = {
    LOGOUT: -1,
    SMS_CODE: 1,
    TOKEN: 2,
    WXCODE: 3,
}

exports.main = async (event, context) => {

    try {
        switch (event.loginMethod) {
            case LoginMethod.LOGOUT:
                return logout(event.uniIdToken);
            case LoginMethod.SMS_CODE: // smsCode
                return await loginWithSmsCode(event);
            case LoginMethod.TOKEN:
            // return event;
                const res = await uniID.checkToken(event.uniIdToken);
                if (res.code == 0) {
                    return {
                        success: true,
                        token: res.token,
                        userInfo: res.userInfo,
                    }
                } else {
                    return {
                        success: false,
                        code: -1,
                        message: res.message,
                    }
                }
            default:
                throw new Error('invalid LoginMethod');
        }
    } catch(e) {
        return {
            success: false,
            code: -1,
            error: e,
        }
    }
    
    
    
};

async function logout(uniIdToken) {
    const res = await uniID.logout(uniIdToken);
    if (res.code == 0) {
        return { success: true }
    } else {
        return { success:false, code: -1, message: res.message}
    }
}

async function loginWithToken(opt) {
    // const {
    //     uniIdToken
    // } = opt;
    const res = await uniID.checkToken(uniIdToken);
    if (res.code == 0) {
        return {
            success: true,
            token: res.token,
            userInfo: res.userInfo,
        }
    } else {
        return {
            success: false,
            code: -1,
            res: res
        }
    }
}

async function loginWithSmsCode(opt) {
    const { mobile, code } = opt;
    
    let res = await uniID.loginBySms({ mobile, code });
    if (res.code != 0) return { success: false, error: res.message }
    const token = res.token;
    
    if (res.type == 'register') {
        const nickname = generateNickname();
        await db.collection('balance').add({ _id: res.uid, balance: 0})
        await db.collection('uni-id-users').doc(res.uid).update({orderCount: 0, nickname})
        res = await uniID.checkToken(token);
        if (res.code == 0) {
            return {
                success: true,
                token: token,
                userInfo: res.userInfo,
            }
        } else {
            return {
                success: false,
                code: -1,
                res: res
            }
        }
    } else {
      return {
          success: true,
          userInfo: res.userInfo,
          token: token,
      }
    }

    

}

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





async function register(opt) {
    const res = await uniID.register({
        username: opt.tel,
        password: opt.password,
    });
    
}






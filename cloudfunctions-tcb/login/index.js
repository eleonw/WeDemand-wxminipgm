'use strict';

const request = require('request');

exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log('event : ' + event)
  //返回数据给客户端
  let res;
  
  const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa90a21c9fbeeacc2&secret=e99cbe2b47ba8ff484f453e6a0c488b4&js_code=' + event.code + '&grant_type=authorization_code'
  
  try {
      const res = await new Promise((resolve, reject) => {
          request(url, (err, resp, body) => {
              if (err) {
                  reject(err);
              }
              resolve(body);
          })
      })
      return res;
  } catch(e) {
      console.log(e),
  }
};



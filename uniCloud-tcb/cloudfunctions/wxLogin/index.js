'use strict';
const request = require('request')

exports.main = async (event, context) => {
  
	const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx6d2f4a55f3e7787b&secret=b6e734b2dcca3e466a3fb04aa2603ad7&js_code=' + event.code + '&grant_type=authorization_code'
	let wechatInfo = await new Promise((resolve, reject) => {
	    request(url, (err, resp, body) => {
	        if (err) {
	            reject(err);
	        }
	        resolve(body);
	    })
	})
  return JSON.parse(wechatInfo);
};

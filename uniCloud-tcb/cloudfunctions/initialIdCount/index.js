'use strict';
const idCount = uniCloud.database().collection('id-count');

const DAY_TIME = 1000 * 60 * 60 * 24;
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    
    const dateNumber = date - 0;
    for (let i = 0; i < 500; i++) {
        let res = await idCount.add({
            _id: dateNumber + i*DAY_TIME,
            count: 0,
        })
        console.log(res)
    }
};

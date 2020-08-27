'use strict';
const db = uniCloud.database();
const order = db.collection('order');

function formatNumber(opt) {
    let numberString = opt.value.toString();
    if (numberString.length > opt.strLength) {
        throw new Error('value exceed')
    } else {
        let boundary = opt.strLength - numberString.length;
        while (boundary) {
            numberString = '0' + numberString;
            boundary--;
        }
        return numberString;
    }
}

exports.main = async (event) => {

    /**
     * event.serviceType:
     * 1: create
     * 2: cancel
     * 3: complete
     * 4: evaluate
     * 5: go into exception
     * 
     * orders' status:
     * 1: created
     * 2: serving
     * 3: evaluating
     * 4: completed
     * 5: canceled
     * 6: exception
     */
    
    const userId = event.userId;
    

    try {
        create({
            userId,
            order: event.order
        });
        
        // switch(event.serviceType) {
        //     case 1:
        //         create();
        //         break;
        //     case 2:
        //         cancel();
        //     case 3:
        //         complete();
        //     case 4:
        //         evaluate();
        // }
    } catch(e) {
        return {
            success: false,
            error: e,
        }
    }
	
	
	//返回数据给客户端
};


async function create(arg) {
    
    const createrId = arg.userId;
    
    const _id = await getOrderId();
    
    const status = 1;
    const timestamp = Number(new Date());
    
    const res = await order.add({
        _id,
        createrId,
        status,
        timestamp,
        ...arg.order,
    })
    
    return res.id;
  
    
}

async function getOrderId() {

    const date = new Date();
    const dateString = formatNumber({
        value: Number(date),
        strLength: 14,
    })
    
    let res = await uniCloud.callFunction({
        name: 'getIdCount',
        data: {
            time: Number(date),
        }
    });
    
    if (!res.result.success) {
        throw new Error();
    } 
    
    let value = (res.result.idCount + (date.getDate()+date.getMonth())*date.getFullYear()) % 100000000; 
    const idCount = formatNumber({
        value,
        strLength: 8,
    });
    
    return '001' + dateString.substring(-3) + dateString.substring(0, -3) + idCount;

}

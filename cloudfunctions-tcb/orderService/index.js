'use strict';
const db = uniCloud.database();
const order = db.collection('order');


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
     * 2. accepted
     * 3: serving
     * 4: evaluating
     * 5: completed
     * -2: canceled
     * -1: exception
     */
    
    const userId = event.userId;
    

    try {
        const orderId = await create({
            userId,
            order: event.order
        });
        return {
            orderId,
            success: true
        }
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
    
    const _id = (await uniCloud.callFunction({
        name: 'createId',
        data: {
            timestamp: Number(new Date()),
            type: 1,
        }
    })).result;
    
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



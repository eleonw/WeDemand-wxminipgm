'use strict';
const db = uniCloud.database();
const order = db.collection('order');

exports.main = async (event) => {

    /**
     * event.side:
     * 0: creater
     * 1: server
     * 
     * event.serviceType:
     * for creater:
     * 1: initial
     * 2: create
     * 3: evaluate
     * 4: cancel
     * 5: go to exception
     * 
     * for server:
     * 
     * 
     * event.serviceY
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
    
    switch(event.side) {
        case 0:     // creater
            switch(event.serviceType) {
                case 1: // initial
                    const order = event.order;
                    try {
                        const orderId = await initial({
                            userId,
                            order
                        })
                        return {
                            orderId,
                            success: true
                        }
                    } catch(e) {
                        return {
                            success: false,
                            code: -1
                        }
                    }
                case 2: // create
                    const orderId = event.orderId;
                    try {
                        await create({orderId});
                        return {
                            success: true,
                        }
                    } catch(e) {
                        return {
                            success: false,
                            code: -1,
                        }
                    }
                case 3: // 
                    
                    
                    
                    
            }
            break;
        case 1:     // server

            break;
        default:
            throw new Error("invalid side");
    }
    

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



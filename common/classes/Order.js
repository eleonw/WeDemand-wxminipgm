import Address from '@/common/classes/Address.js';
import Location from '@/common/classes/Location.js';

import { orderStatus, serviceType } from '@/common/globalData.js';

function Order(arg={}) {
   
    this._id = arg._id;
    this.serviceType = arg.serviceType;
    
    this.createrId = arg.createrId;
    this.serverId = arg.serverId;
    
    this.createTime = arg.createTime;
    this.expireTime = arg.expireTIme;
    
    this.startTime = arg.startTime;
    this.endTime = arg.endTime;
    
    this.couponId = arg.couponId,
    this.cost = arg.cost;
    
    this.status = arg.status ? arg.status : orderStatus.INITIALING;

}

function Order_HelpDeliver(arg={}) {
    
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status,
        fromAddress, toAddress, itemInfo, note
    } = arg;
    
    Order.call(this, {_id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, serviceType: serviceType.HELP_DELIVER});
    
    this.fromAddress = new Address(fromAddress);
    this.toAddress = new Address(toAddress);

    this.itemInfo = itemInfo;
    this.note = note;

}

Order_HelpDeliver.prototype = new Order();

Order_HelpDeliver.prototype.getItemInfoString = function() {
    let result = '';
    for (let item in this.itemInfo) {
        result = result + this.itemInfo[item] + '、';
    }
    return result == '' ? '' : result.slice(0, -1);
}

const testOrder_HelpDeliver = new Order_HelpDeliver({
    _id: "0010159852745706700068688",
    fromAddress: Address.defaultAddress,
    toAddress: Address.defaultAddress,
    serviceType: 1,
    cost: {
       basic: 1,
       tip: 4,
    },
    startTime: 1598827512653,
    endTime: 1598827522653,
    status: 0,
    note: '没有什么要注意的',
    itemInfo: {
        weight: '5kg',
        type: '外卖'
    }
})

function Order_HelpBuy(arg={}) {
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, commodityDesc, 
        address, buyingLocation
    } = arg;
    
    Order.call(this, {_id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, serviceType: serviceType.HELP_BUY});
    
    this.commodityDesc = commodityDesc;
    this.address = new Address(address);
    this.buyingLocation = new Location(buyingLocation);
    
}


Order_HelpBuy.prototype = new Order();

const testOrder_HelpBuy = new Order_HelpBuy({
    _id: "0010159852745706700068688",
    startTime: 1598827512653,
    endTime: 1598827522653,
    cost: {
       basic: 1,
       tip: 4,
    },
    status: 1,
    commodityDesc: "这是商品描述",
    address: Address.defaultAddress,
    buyingLocation: Location.defaultLocation,
    
})



function Order_OtherService(arg={}) {
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, address, serviceDesc
    } = arg;
    
    Order.call(this, {_id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, 
        cost, status, serviceType: serviceType.OTHER_SERVICE});
    this.address = new Address(address);
    this.serviceDesc = serviceDesc;
}

Order_OtherService.prototype = new Order();

const testOrder_OtherService = new Order_OtherService({
    _id: "001015985274570670006863",
    startTime: 1598837512653,
    endTime: 1598837522653,
    cost: {
       basic: 1,
       tip: 4,
    },
    status: 1,
    address: Address.defaultAddress,
    serviceDesc: "这是服务信息",
    
})

function parseOrder(arg) {
    
    if (!arg.serviceType) {
        console.log(arg)
        throw new Error('no valid service type');
    }
    switch (arg.serviceType) {
        case serviceType.HELP_DELIVER:
            return new Order_HelpDeliver(arg);
        case serviceType.HELP_BUY:
            return new Order_HelpBuy(arg);
        case serviceType.OTHER_SERVICE:
            return new Order_OtherService(arg);
        default:
            throw new Error('no valid service type');
    }
}

export { Order_HelpDeliver, Order_HelpBuy, Order_OtherService, parseOrder, testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService };
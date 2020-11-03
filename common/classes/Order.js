import Address from '@/common/classes/Address.js';
import Location from '@/common/classes/Location.js';

import { orderStatus, serviceType } from '@/common/globalData.js';

function Order(arg={}) {
   
    this._id = arg._id;
    this.serviceType = arg.serviceType;
    
    this.createrId = arg.createrId;
    this.serverId = arg.serverId;
    
    this.createTime = arg.createTime;
    this.expireTime = arg.expireTime;
    
    this.startTime = arg.startTime;
    this.endTime = arg.endTime;
    
    this.sensitiveInfo = arg.sensitiveInfo;
    
    this.couponId = arg.couponId,
    this.cost = arg.cost;
    
    this.commentId = arg.commentId;
    
    this.status = arg.status ? arg.status : orderStatus.INITIALING;
    this.sensitiveInfo = arg.sensitiveInfo;
    
    this.evalStatus = arg.evalStatus;
    this.cancelSide = arg.cancelSide;

    this.confirmCode = arg.confirmCode;
}

Order.prototype.getSensitiveInfoArray = function() {
    const array= [];
    if (this.sensitiveInfo) {
        const mainSensitives = []
        for (let item in this.sensitiveInfo) {
            const infoStr = this.sensitiveInfo[item].trim();
            if (infoStr != '') {
                mainSensitives.push();
            }
        }
        
        if (mainSensitives.length != 0) {
            array.push({title: '敏感信息', content: mainSensitives.join("; ")});
        }
    }
    return array;
}

function Order_HelpDeliver(arg={}) {
    
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, sensitiveInfo,   // expressInfo, takeAwayInfo 
        fromAddress, toAddress, itemInfo, note, evalStatus, cancelSide, confirmCode
    } = arg;
    
    Order.call(this, arg);
    
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

Order_HelpDeliver.prototype.getSensitiveInfoArray = function() {
    // expressInfo, takeAwayInfo
    const array = [];
    const others = [];
    for (let item in this.sensitiveInfo) {
        const infoStr = this.sensitiveInfo[item].trim();
        if (infoStr.length != 0) {
            if (item == 'expressInfo') {
                array.push({title: '快递信息', content: infoStr});
            } else if (item == 'takeAwayInfo') {
                array.push({title: '外卖信息', content: infoStr});
            } else {
                others.push(infoStr);
            }
        }
    }
    if (others.length != 0) {
        array.push({title: '敏感信息', content: others.join("; ")})
    }
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
    expireTime: 1598827522653,
    status: orderStatus.CREATED,
    note: '没有什么要注意的',
    itemInfo: {
        weight: '5kg',
        type: '外卖'
    }
})

function Order_HelpBuy(arg={}) {
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, commodityDesc, 
        address, buyingLocation, sensitiveInfo, evalStatus, cancelSide
    } = arg;
    
    Order.call(this, arg);
    
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
    status: orderStatus.CREATED,
    commodityDesc: "这是商品描述",
    address: Address.defaultAddress,
    buyingLocation: Location.defaultLocation,
    expireTime: 1598827522653,
    
})



function Order_OtherService(arg={}) {
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, address, serviceDesc, sensitiveInfo,
        evalStatus, cancelSide
    } = arg;
    
    Order.call(this, arg);
    this.address = new Address(address);
    this.serviceDesc = serviceDesc;
}

Order_OtherService.prototype = new Order();

const testOrder_OtherService = new Order_OtherService({
    _id: "001015985274570670006863",
    startTime: 1598837512653,
    endTime: 1598837522653,
    expireTime: 1598827522653,
    cost: {
       basic: 1,
       tip: 4,
    },
    status: orderStatus.COMPLETED,
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
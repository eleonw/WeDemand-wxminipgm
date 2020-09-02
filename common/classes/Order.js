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
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status} = arg;
    
    Order.call(this, {_id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, serviceType: serviceType.HELP_DELIVER});
    
    this.fromAddress = arg.fromAddress;
    this.toAddress = arg.toAddress;

    this.itemInfo = arg.itemInfo;
    this.note = arg.note;

}

Order_HelpDeliver.prototype = new Order();

function Order_HelpBuy(arg={}) {
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status} = arg;
    
    Order.call(this, {_id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, serviceType: serviceType.HELP_BUY});
    
    this.commodityDesc = arg.commodityDesc;
    this.buyingLocation = arg.buyingLocation;
    
}

Order_HelpBuy.prototype = new Order();

function Order_OtherService(arg={}) {
    const {
        _id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status} = arg;
    
    Order.call(this, {_id, createrId, serverId, createTime, expireTime, startTime, endTime, couponId, cost, status, serviceType: serviceType.HELP_BUY});
}

Order_OtherService.prototype = new Order();
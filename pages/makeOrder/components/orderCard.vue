<template>
    <view class="root card">
        
        <view class="header">
            <view class="orderType">{{ getOrderTypeString(order.serviceType) }}</view>
            <view class="orderStatus">{{ getOrderStatusString(order.status) }}</view>
        </view>
        
        <view class="main">
            
            <view v-if="order.serviceType==serviceType.HELP_DELIVER">
            <view class="row">
                <textIcon text="取" :backgroundColor="color.LIGHT" class="textIcon"></textIcon>
                <view class="address">
                    <view class="addressMain"> 
                        {{ orderObj.fromAddress.location.toString() }} 
                    </view>
                    <view class="addressSub">
                        {{ orderObj.fromAddress.name + ' ' + orderObj.fromAddress.mobile }}
                    </view>
                </view>
            </view>
            
            <view class="row">
                <textIcon text="送" :backgroundColor="color.DARK" class="textIcon"></textIcon>
                <view class="address">
                    <view class="addressMain">
                        {{ orderObj.toAddress.location.toString() }}
                    </view>
                    <view class="addressSub">
                        {{ orderObj.toAddress.name + ' ' + orderObj.toAddress.mobile}}
                    </view>
                </view>
            </view>
            
            <view class="row">
                <view class="title">取件时间</view>
                <view>{{ getTimeRangeString() }}</view>
            </view>
            
            <view class="row">
                <view class="title">物品信息</view>
                <view>{{ getItemInfoString() }}</view>
            </view>
            <view class="row" v-if="orderObj.note.trim() != ''">
                <view class="title">备注信息</view>
                <view>{{ orderObj.note }}</view>
            </view>
            </view>
            
            <view v-else-if="order.serviceType==serviceType.HELP_BUY">
            <view class="row">
                <textIcon text="送" :backgroundColor="color.LIGHT" class="textIcon"></textIcon>
                <view class="address">
                    <view class="addressMain"> 
                        {{ orderObj.address.location.toString() }} 
                    </view>
                    <view class="addressSub">
                        {{ orderObj.address.name + ' ' + orderObj.address.mobile }}
                    </view>
                </view>
            </view>
            <view class="row">
                <view class="title">送货时间</view>
                <view>{{ getTimeRangeString() }}</view>
            </view>
            <view class="row">
                <view class="title">商品信息</view>
                <view>{{ orderObj.commodityDesc }}</view>
            </view>
            <view class="row">
                <view class="title">购买地址</view>
                <view>{{ orderObj.buyingLocation ? orderObj.buyingLocation.toString() : '就近购买' }}</view>
            </view>
            </view>
            
            <view v-else-if="order.serviceType==serviceType.OTHER_SERVICE">
            <view class="row">
                <textIcon text="至" :backgroundColor="color.LIGHT" class="textIcon"></textIcon>
                <view class="address">
                    <view class="addressMain"> 
                        {{ orderObj.address.location.toString() }} 
                    </view>
                    <view class="addressSub">
                        {{ orderObj.address.name + ' ' + orderObj.address.mobile }}
                    </view>
                </view>
            </view>
            <view class="row">
                <view class="title">服务时间</view>
                <view>{{ getTimeRangeString() }}</view>
            </view>
            <view class="row">
                <view class="title">服务内容</view>
                <view>{{ orderObj.serviceDesc }}</view>
            </view>
            </view>
            
            <view v-for="(info,idx) in sensitiveInfo" :key="idx">
                <view class="row">
                    <view class="title">{{ info.title }}</view>
                    <view>{{ info.content }}</view>
                </view>
            </view>

            
            <view class="row">
                <view class="title">小费</view>
                <view>{{ getMoneyString(orderObj.cost.tip) }}￥</view>
            </view>
                    
        </view>
        
        <view class="row orderId">
            订单编号：{{ orderObj._id }}
        </view>
        
        <view class="row operations">
            <view class="cancelOrder" v-if="showCancel" @click="cancelOrder">
                取消订单
            </view>
            <view class="button" :class="[{'active': activeButton}]" @click="clickButton">
                {{ buttonText }}
            </view>
        </view>
       
        
        
    </view>
</template>

<script>
    
    import textIcon from '@/components/textIcon/textIcon.vue';
    
    import { serviceType, orderStatus, color } from '@/common/globalData.js';
    import { parseOrder } from '@/common/classes/Order.js';
    
    import { getTimeString, getMoneyString } from '@/common/helper.js';
    
    let that;
    
    export default {
        name: 'orderCard',
        components: {
            textIcon,
        },
        props: {
            order: {
                type: Object,
                required: true,
            },
            showPrivate: {
                type: [Boolean, String],
                default: false,
            }
        },
        data() {
            return {
                serviceType: null,
                orderObj: null,
                color: null,
                sensitiveInfo: [],
                buttonText: null,
                activeButton: null,
                showCancel: null,
            }
        },
        methods: {
            getOrderTypeString: function(type) {
                return serviceType.getServiceTypeString(type);
            },
            getOrderStatusString: function(status) {
                return orderStatus.getOrderStatusString(status);
            },
            getTimeRangeString: function() {
                return getTimeString({timestamp: that.orderObj.startTime, substitude: '现在'}) + '-'
                    + getTimeString({timestamp: that.orderObj.endTime, substitude: '现在'})
            },
            getItemInfoString: function() {
                return that.orderObj.getItemInfoString();
            },
            clickButton: function() {
                console.log('clickButton')
                console.log(that)
                console.log(that.activeButton)
                if (that.activeButton) {
                    this.$emit('buttonClick')
                }
            },
            cancelOrder: function() {
                this.$emit('cancel');
            },
            getMoneyString: function(money) {
                return getMoneyString(money);
            }
        },
        created: function() {
            that = this;
            that.orderObj = parseOrder(that.order);
            that.serviceType = serviceType;
            that.color = color;
            that.sensitiveInfo = that.orderObj.getSensitiveInfoArray();
            switch(that.orderObj.status) {
                case orderStatus.INITIALING:
                    console.log('orderstatus.initial')
                    that.activeButton = true;
                    that.buttonText = "付款";
                    that.showCancel = true;
                    break;
                case orderStatus.CREATED:
                    that.activeButton = false;
                    that.buttonText = "等待接单";
                    that.showCancel = true;
                    break;
                case orderStatus.ACCEPTED:
                    that.activeButton = false;
                    that.buttonText = "等待服务";
                    that.showCancel = true;
                    break;
                case orderStatus.SERVING:
                    that.activeButton = true;
                    that.buttonText = "查看验证码";
                    that.showCancel = true;
                    break;
                case orderStatus.EVALUATING:
                    if (that.orderObj.evalStatus == 0) {
                        that.activeButton = false;
                        that.buttonText = "等待评价";
                    } else {
                        that.activeButton = true;
                        that.buttonText = "评价";
                    }
                    that.showCancel = false;
                    break;
                case orderStatus.COMPLETED:
                    that.activeButton = false;
                    that.buttonText = "已完成";
                    that.showCancel = false;
                    break;
                case orderStatus.CANCELED:
                    that.activeButton = false;
                    that.buttonText = "已取消";
                    that.showCancel = false;
                    break;
                case orderStatus.CANCELING:
                    if (orderStatus.cancelSide == 0) {
                        that.activeButton = false;
                        that.buttonText = '等待取消';
                    } else {
                        that.activeButton = true;
                        that.buttonText = '同意取消';
                    }
                    that.showCancel = false;
                    break;
                case orderStatus.EXCEPTION:
                    that.activeButton = false;
                    that.buttonText = '异常处理中';
                    that.showCancel = false;
                    break;
                default:
                    console.log('invalid orderStatus')
            }
            
        },
        
        mounted: function() {
            console.log(that.activeButton)
        }
    }

</script>

<style scoped lang="scss">
    
    @import "@/common/style/orderCard.scss"
    
</style>

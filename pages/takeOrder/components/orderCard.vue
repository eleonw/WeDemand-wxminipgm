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
                    <view class="addressSub" v-if="showPrivate">
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
                    <view class="addressSub" v-if="showPrivate">
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
           
               
            </view>
            
            <view v-else-if="order.serviceType==serviceType.HELP_BUY">
            <view class="row">
                <textIcon text="送" :backgroundColor="color.LIGHT" class="textIcon"></textIcon>
                <view class="address">
                    <view class="addressMain"> 
                        {{ orderObj.address.location.toString() }} 
                    </view>
                    <view class="addressSub" v-if="showPrivate">
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
                    <view class="addressSub" v-if="showPrivate">
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
            
            
            <view class="row">
                <view class="title">小费</view>
                <view>{{ orderObj.cost.tip }}￥</view>
            </view>
                    
        </view>
        
        <view class="button" @click="clickButton">
            {{ getButtonTitle() }}
        </view>
        
        
    </view>
</template>

<script>
    
    import textIcon from '@/components/textIcon/textIcon.vue';
    
    import { serviceType, orderStatus, color } from '@/common/globalData.js';
    import { parseOrder } from '@/common/classes/Order.js';
    
    import { getTimeString } from '@/common/helper.js';
    import { userInfo } from '@/common/globalData.js';
    
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
            identity: {
                type: Number,   // 0: creater; 1: server
                default: 0,
            },
            showPrivate: {
                type: [Boolean, String],
                default: false,
            }
        },
        data() {
            return {
                showPrivate: false,
                serviceType: null,
                orderObj: null,
                color: null,
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
            getButtonTitle: function() {
                if (that.identity == 0) {
                    switch(that.orderObj.status) {
                        case orderStatus.INITIALING:
                            return "付款";
                        case orderStatus.CREATED:
                            return "取消";
                        case orderStatus.ACCEPTED:
                            return "取消";
                        case orderStatus.SERVING:
                            return "取消";
                        case orderStatus.EVALUATING:
                            return "评价";
                        default:
                            return null;
                    }
                } else if (that.identity == 1) {
                    switch(that.orderObj.status) {}
                }
            },
            clickButton: function() {
                this.$emit('buttonClick')
            }
        },
       
        created: function() {
            that = this;
            that.orderObj = parseOrder(that.order);
            that.serviceType = serviceType;
            that.color = color;      
            
            if (that.orderObj.serverId == UserInfo._id) {
                showPrivate = true;
            } else {
                showPrivate = false;
            }
        },
    }

</script>

<style scoped lang="scss">
    
    .root {
        display: flex;
        flex-flow: column nowrap;
        
        justify-content: flex-start;
        
        width: 700rpx;
        background-color: white;
        
        overflow: hidden;
        
        font-size: 30rpx;
        box-shadow: 0 5px 10px 2px gray;
        
        .header {
            height: 80rpx;
            line-height: 80rpx;
            
            background-color: var(--color-main);
            display: flex;
            flex-flow: row nowrap;
            
            padding: 0 20rpx;
            
            
            color: white;
            
            .orderType {
                font-weight: 600;
            }
            
            .orderStatus {
                margin-left: auto;
            }
            
        }
        
        .row {
            display: flex;
            flex-flow: row nowrap;
            
            justify-content: baseline;
            margin: 20rpx;
            
            .textIcon {
                margin-right: .5em;
            }
            
            .addressMain {
                font-size: 1.2em;
                font-weight: 500;
            }
            
            .title {
                
                width: 130rpx;
                margin-right: .3em;
                padding-right: 10rpx;
                padding-left: 10rpx;
                
                text-align: justify;
                text-align-last: justify;
                
                border-right: var(--color-main) 1rpx solid;
                border-left: var(--color-main) 1rpx solid;
            }
        
        }
        
        .button {
            width: 500rpx;
            height: 50rpx;
            line-height: 50rpx;
            background-color: var(--color-main);
            color: white;
            
            text-align: center;
            
            margin: 30rpx auto 30rpx auto;
            
            letter-spacing: 20rpx;
            font-weight: 600;
            
            border-radius: 10rpx;
        }
        
        
    }
    
    
    
    
    
    
    
    
</style>

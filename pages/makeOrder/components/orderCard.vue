<template>
    <view class="root card">
        
        <view class="header">
            <view class="orderType">{{ getOrderTypeString(order.serviceType) }}</view>
            <view class="orderStatus">{{ getOrderStatusString(order.status) }}</view>
        </view>
        
        
        <view class="main" v-if="order.serviceType==serviceType.HELP_DELIVER">
            <view class="row">
                <textIcon text="取" :backgroundColor="color.LIGHT"></textIcon>
                <view class="address">
                    <view class="addressMain"> 
                        {{ orderObj.fromAddress.location.toString() }} 
                    </view>
                    <view class="addressSub" v-if="showDetail">
                        {{ orderObj.fromAddress.name + ' ' + orderObj.fromAddress.mobile }}
                    </view>
                </view>
            </view>
            
            <view class="row">
                <textIcon text="送" :backgroundColor="color.DARK"></textIcon>
                <view class="address">
                    <view class="addressMain">
                        {{ orderObj.toAddress.location.toString() }}
                    </view>
                    <view class="addressSub" v-if="showDetail">
                        {{ orderObj.toAddress.name + ' ' + orderObj.toAddress.mobile}}
                    </view>
                </view>
            </view>
           
        </view>
        
        <view class="main" v-else-if="order.serviceType==serviceType.HELP_BUY">
            
        </view>
        
        <view class="main" v-else-if="order.serviceType==serviceType.OTHER_SERVICE">
            
        </view>
        
        
        <view class="buttons">
            
        </view>
        
        
    </view>
</template>

<script>
    
    import textIcon from '@/components/textIcon/textIcon.vue';
    
    import { serviceType, orderStatus, color } from '@/common/globalData.js';
    import { orderFactory } from '@/common/classes/Order.js';
    
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
            showDetail: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
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
            }
        },
        created: function() {
            that = this;
            that.serviceType = serviceType;
            that.orderObj = orderFactory(that.order);
            that.color = color;
        },
    }
    
</script>

<style scoped lang="scss">
    
    .root {
        width: 700rpx;
        height: 500rpx;
        background-color: white;
        
        overflow: hidden;
    }
    
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

    }
    
    
    
</style>

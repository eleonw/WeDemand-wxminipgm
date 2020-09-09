<template>
    <view class="root card">
        
        <view class="header">
            <view class="orderType">{{ getOrderTypeString(order.serviceType) }}</view>
            <view class="orderStatus">{{ getOrderStatusString(order.status) }}</view>
        </view>
        
        
        <view class="main" v-if="order.serviceType==serviceType.HELP_DELIVER">
            <view class="fromAddress"></view>
            <view class="toAddress"></view>
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
    
    import { serviceType, orderStatus } from '@/common/globalData.js';
    
    let that;
    
    export default {
        name: 'orderCard',
        props: {
            order: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                serviceType: null,
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
            that.serviceType = serviceType
        }
    }
</script>

<style scoped>
    
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
        
        color: white
    }
    
    .orderType {
        font-weight: 600;
    }
    
    .orderStatus {
        margin-left: auto;
    }
    
    
    
</style>

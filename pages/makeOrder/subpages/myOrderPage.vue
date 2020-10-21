<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
        
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard" 
            :order="order" v-if="orderStatusShowMap[order.status]" @buttonClick="buttonClick(index)"> </orderCard>
        
        <view class="loadMore"></view>
        
        <paymentMethodSelector class="selector" v-if="show_paymentMethodSelector" @exit="hideSelector('paymentMethodSelector')" :cost="cost"></paymentMethodSelector>
        
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import topTabBar from '@/components/topTabBar/topTabBar.vue';
    import orderCard from '@/components/orderCard/orderCard.vue';
    import paymentMethodSelector from '@/components/paymentMethodSelector/paymentMethodSelector.vue';
    
    import eventBus from './../eventBus.js';
    
    import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
    import { orderStatus } from '@/common/globalData.js';
    import shareData from '../shareData.js';
    
    import { promisify } from '@/common/helper.js';
    
    
    let that;
    
	export default {
        name: 'myOrderPage',
        components: {
            uniNavBar, topTabBar, orderCard, paymentMethodSelector
        },
		data() {
			return {
                orderList: [
                    testOrder_HelpBuy,
                    testOrder_HelpDeliver,
                    testOrder_OtherService
                ],
                tabIndex: 0,
                tabs: [
                    {
                        index: 0,
                        text: '全 部',
                    },
                    {
                        index: 1,
                        text: '待服务',
                    },
                    {
                        index: 2,
                        text: '进行中',
                    },
                    {
                        index: 3,
                        text: '待评价',
                    },
                    {
                        index: 4,
                        text: '已结束',
                    },
                    {
                        index: 5,
                        text: '异 常',
                    }
                ],
                orderList: [],
                orderStatusShowMap: {
                    [orderStatus.INITIALING]: true,
                    [orderStatus.CREATED]: true,
                    [orderStatus.ACCEPTED]: true,
                    [orderStatus.SERVING]: true,
                    [orderStatus.EVALUATING]: true,
                    [orderStatus.COMPLETED]: true,
                    [orderStatus.EXCEPTION]: true,
                    [orderStatus.CANCELED]: true,
                    [orderStatus.CANCELING]: true,
                },
                cost: 0,
                show_paymentMethodSelector: false,
			}
		},
        
        beforeCreate: function() {
            that = this;
        },
        
		methods: {
			navigateBack: function() {
                uni.navigateBack();
            },
            
            switchTab: function(e) {
                switch(e.index) {
                    case 0:
                        that.updateStatusShowMap();
                        
                        break;
                    case 1:
                        that.updateStatusShowMap(orderStatus.INITIALING, orderStatus.CREATED);
                        break;
                    case 2:
                        that.updateStatusShowMap(orderStatus.ACCEPTED, orderStatus.SERVING, orderStatus.CANCELING);
                        break;
                    case 3:
                        that.updateStatusShowMap(orderStatus.EVALUATING);
                        break;
                    case 4:
                        that.updateStatusShowMap(orderStatus.COMPLETED, orderStatus.CANCELED);
                        break;
                    case 5:
                        that.updateStatusShowMap(orderStatus.EXCEPTION);
                        break;
                }
            },
            
            updateStatusShowMap: function(...visibleStatus) {
                if (visibleStatus.length == 0) {
                    for (let status in that.orderStatusShowMap) {
                        that.orderStatusShowMap[status] = true;
                    }
                    return;
                }
                for (let status in that.orderStatusShowMap) {
                    that.orderStatusShowMap[status] = false;
                }
                for (let status of visibleStatus) {
                    that.orderStatusShowMap[status] = true;
                }
            },
            
            createOrder: async function(index) {
                const order = shareData.orderList[index];
                let res = await promisify(uni.showModal, {content: '付款后取消订单将会扣取25%费用', icon: 'none'});
                if (res.cancel) {
                    return;
                }

                res = await that.pay(cost)
                if (!res.success) {
                    return;
                }
                uni.showLoading();
                res = await orderAssistant.create({orderId: order._id});
                uni.hideLoading();
                uni.showToast({
                    title: '订单创建成功',
                    icon: 'success',
                })
                order.status = orderStatus.CREATED;
            },
            
            cancelOrder: async function(index) {
                const order = shareData.orderList[index];
                let notice, res;
                switch(order.status) {
                    case orderStatus.INITIALING:
                        notice = '确认是否要取消订单'
                        break;
                    case orderStatus.CREATED:
                        notice = '频繁地取消订单会影响您的信用评分';
                        break;
                    case orderStatus.ACCEPTED:
                        notice = '已接单，订单取消将扣取50%违约金';
                        break;
                    case orderStatus.SERVING:
                        notice = '服务中，订单取消需与对方协商';
                        break;
                    default:
                        throw new error('not a status for canceling');
                }
                res = promisify(uni.showToast, {content: notice, icon: 'none'});
                if (res.cancel) {
                    return;
                }
                uni.showLoading();
                res = await orderAssistant.cancel({orderId: order._id})
                if (res.success) {
                    uni.showToast({
                        title: '订单取消成功',
                        icon: 'success',
                    })
                    shareData.orderList[index].status = CANCELED;
                } else {
                    uni.showToast({
                        title: '订单取消失败，请重试',
                        icon: 'none'
                    })
                }
                
            },
            
            evaluateOrder: async function(index) {
                uni.navigateTo({
                    url: '/pages/makeOrder/evaluateOrder/evaluateOrder',
                    
                }),
                eventBus.$on('evaluateOrder', function(e) {
                    if (e.success) {
                        shareData.orderList[index].status = orderStatus.COMPLETED;
                    }
                    eventBus.$off('evaluateOrder');
                })
            },
            
            buttonClick: async function(index) {
                const order = that.orders[index];
                console.log(order);
                
                let success = false;
                let res;
                
                switch(order.status) {
                    
                        
                }
            },
            
            hideSelector: function(type) {
                that['show_'+type] = false;
            },
		},
        
        created: function() {
            eventBus.$on('reachBottom', function() {
                console.log('reachBottom received');
            })
        }
	}

</script>

<style>
    .page {
        padding-top:  calc(var(--height-navbar) + var(--height-toptabbar));
        padding-bottom: calc(var(--height-tabbar) + 20rpx);
    }

    .topTabBar {
        z-index: 1;
        position: fixed;
        top: var(--height-navbar);
        left: 0;
        width: 100vw;
        background-color: var(--color-main);
        color: white;
    }
    
    .test {
        background-color: orange;
        width: 100vw;
        height: 40vh;
        
        margin-top: 20rpx;
    }
    
    .orderCard {
        margin: 30rpx 0;
    }
    
    .selector {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
    }
    
</style>

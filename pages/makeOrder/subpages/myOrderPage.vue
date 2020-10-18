<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
        
        <orderCard v-for="(order,index) in orders" :key="index" class="orderCard" :order="order" v-if="orderStatusShowMap[order.status]"> </orderCard>
        
        <view class="loadMore"></view>
        
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import topTabBar from '@/components/topTabBar/topTabBar.vue';
    import orderCard from '@/components/orderCard/orderCard.vue';
    
    import eventBus from '@/common/eventBus.js';
    
    import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
    import { orderStatus } from '@/common/globalData.js';
    
    
    let that;
    
	export default {
        name: 'myOrderPage',
        components: {
            uniNavBar, topTabBar, orderCard
        },
		data() {
			return {
                orders: [
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
                        text: '异常',
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
                }
			}
		},
        
        created: function() {
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
                        that.updateStatusShowMap(orderStatus.ACCEPTED, orderStatus.SERVING);
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
                    for (let status in orderStatus) {
                        orderStatusShowMap[status] = true;
                    }
                    return;
                }
                for (let status in orderStatus) {
                    orderStatusShowMap[status] = false;
                }
                for (let status of visibleStatus) {
                    orderStatusShowMap[status] = true;
                }
            }            
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
        padding-bottom: var(--height-navbar)
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
    
</style>

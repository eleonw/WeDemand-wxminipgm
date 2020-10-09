<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
        
        <orderCard v-for="(order,index) in orders" :key="index" class="orderCard" :order="order"> </orderCard>
        
        <view class="loadMore"></view>
        
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import topTabBar from '@/components/topTabBar/topTabBar.vue';
    import orderCard from '@/components/orderCard/orderCard.vue';
    
    import eventBus from '@/common/eventBus.js';
    
    import { testOrder_HelpDeliver as testOrder} from '@/common/classes/Order.js'; 
    
    
    let page;
    
	export default {
        name: 'myOrderPage',
        components: {
            uniNavBar, topTabBar, orderCard
        },
		data() {
			return {
                orders: [
                    testOrder,
                    testOrder,
                    testOrder,
                    testOrder
                ],
                tabIndex: 0,
                tabs: [
                    {
                        index: 0,
                        text: '全 部',
                    },
                    {
                        index: 1,
                        text: '待接单',
                    },
                    {
                        index: 2,
                        text: '服务中',
                    },
                    {
                        index: 3,
                        text: '待评价',
                    },
                    {
                        index: 4,
                        text: '已完成',
                    }
                ],
                orderList: [],
                orderPage: 0,
			}
		},
        
        created: function() {
            page = this;
        },
        
		methods: {
			navigateBack: function() {
                uni.navigateBack();
            },
            
            switchTab: function(e) {
                
            },
            
            test: function(e) {
                console.log(e)
                
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

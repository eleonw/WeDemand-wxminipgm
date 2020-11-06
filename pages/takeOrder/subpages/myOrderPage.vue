<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
		
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
            :order="order" v-if="orderStatusShowMap[order.status]" @buttonClick="buttonClick(index)"> </orderCard>
        
	</view>
</template>

<script>
    import orderCard from './../components/orderCard.vue';
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import topTabBar from '@/components/topTabBar/topTabBar.vue';
    import eventBus from '../eventBus.js';
    
    import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js';
    import { orderStatus } from '@/common/globalData.js';
    
    import { promisify } from '@/common/helper.js';
    
    let that;
    
	export default {
    name: 'myOrderPage',
    components:{
        orderCard, uniNavBar, topTabBar
    },
    components: {
      orderCard,
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
				        text: '进行中',
				    },
				    {
				        index: 2,
				        text: '评价中',
				    },
				    {
				        index: 3,
				        text: '已结束',
				    },
				    {
				        index: 4,
				        text: '异 常',
				    },
				],
				orderList: [],
				orderStatusShowMap: {
				    [orderStatus.ACCEPTED]: true,
				    [orderStatus.SERVING]: true,
				    [orderStatus.EVALUATING]: true,
				    [orderStatus.COMPLETED]: true,
				    [orderStatus.EXCEPTION]: true,
				    [orderStatus.CANCELED]: true,
				    [orderStatus.CANCELING]: true,
				},
			}
		},
		methods: {
			navigateBack: function() {
                uni.navigateBack({
                })
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
            
            switchTab: function(e) {
                switch(e.index) {
                    case 0:
                        that.updateStatusShowMap();
                        break;
                    case 1:
                        that.updateStatusShowMap(orderStatus.ACCEPTED, orderStatus.SERVING, orderStatus.CANCELING);
                        break;
                    case 2:
                        that.updateStatusShowMap(orderStatus.EVALUATING);
                        break;
                    case 3:
                        that.updateStatusShowMap(orderStatus.COMPLETED, orderStatus.CANCELED);
                        break;
                    case 4:
                        that.updateStatusShowMap(orderStatus.EXCEPTION);
                        break;
                    default:
                }
            },
            
            getOrderList: async function() {
                
            },
            
            startPullDownRefresh: function() {
                eventBus.$emit('startPullDownRefresh');
            },
            
            stopPullDownRefresh: function() {
                eventBus.$emit('stopPullDownRefresh');
            }
		},
        
        beforeCreate: function() {
            that = this;
        },
        
        beforeMount: function() {
            // await that.getOrderList({fromStart: true});
            eventBus.$on('reachBottom', async function(){
                console.log('reachBottom received');
                const status = tab2Status[that.tabIndex]
                that.getOrderList({status, fromStart: false});
            })
            eventBus.$on('pullDownRefresh', async function() {
                console.log('pullDownRefresh received');

                that.StopPullDownRefresh();
            })
        },
        
        beforeDestroy: function() {
            eventBus.$off('reachBottom')
            eventBus.$off('pullDownRefresh')
        }
	}
</script>

<style lang="scss">
    
    .page {
        padding-top:  calc(var(--height-navbar) + var(--height-toptabbar));
        padding-bottom: calc(var(--height-tabbar) + 20rpx);
        
        .topTabBar {
            z-index: 1;
            position: fixed;
            top: var(--height-navbar);
            left: 0;
            width: 100vw;
            background-color: var(--color-main);
            color: white;
        }
        
        .orderCard {
            margin: 30rpx 0;
        }
    }
    
    
    
    .selector {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
    }
</style>

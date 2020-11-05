<template>
	<view class="root page">
        
		<uniNavBar class="navigationBar" @clickLeft="navigateBack"></uniNavBar>
        
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
            :order="order" @buttonClick="takeOrder(index)" @cancel="cancelOrder(index)"></orderCard>
            
        <view class="loadMore"></view>
        
        <paymentMethodSelector class="selector" v-if="show_paymentMethodSelector" @exit="hideSelector('paymentMethodSelector')" :cost="targetOrder.totalCost"></paymentMethodSelector>
	
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import orderCard from './../components/orderCard.vue';
    import paymentMethodSelector from '@/components/paymentMethodSelector/paymentMethodSelector.vue';
    
    import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
    import { orderAssistant_creater as orderAssistant } from '@/common/server.js';
    
    let _createdListRec = null;
    const limit = 5;
    let nomore = false;
    let that;
    
	export default {
        name: 'selectOrderPage',
        components: {
            uniNavBar, orderCard,
        },
		data() {
			return {
				orderList: [
                    testOrder_HelpBuy,
                    testOrder_HelpDeliver,
                    testOrder_OtherService
                ],
                targetOrder: null,
                show_paymentMethodSelector: false,
			}
		},
		methods: {
            getOrderList: async function(fromStart) {
                if (fromStart) {
                    that.orderList.clear();
                }
                
                if (nomore) {
                    uni.showToast({
                        title: '没有更多订单，请刷新重试'
                    })
                    return;
                }
                uni.showLoading();
                let res = await orderAssistant.getCreatedOrderList({fromStart, limit, _createdListRec});
                uni.hideLoading();
                if (res.success) {
                    _createdListRec = res._createdListRec;
                    if (res.orderList.length == 0) {
                        nomore = true;
                        uni.showToast({
                            title: '没有更多订单，请刷新重试'
                        })
                        return;
                    } else {
                        that.orderList.push(...res.orderList);
                    }
                } else {
                    uni.showModal({
                        title: '操作失败',
                        content: res.notice,
                        showCancel: false,
                    })
                }
            },
            
            takeOrder: function(index) {
                that.targetOrder = that.orderList[index];
                uni.showModal({
                    title: '提示',
                    content: '接单需要支付订金，将在订单完成后返还',
                    complete: function(e) {
                        if (e.confirm) {
                            that.show_paymentMethodSelector = true;
                        }
                    }
                })
            },
            
            cancelOrder: function(index) {
                
            },
            
            hideSelector: function(type) {
                that['show_'+type] = false;
            },
            
			navigateBack: function() {
                uni.navigateBack()
            },
            
            startPullDownRefresh: function() {
                eventBus.$emit('startPullDownRefresh');
            },
            
            stopPullDownRefresh: function() {
                eventBus.$emit('stopPullDownRefresh');
            }
		},
        beforeCreate: function()  {
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

<style scoped lang="scss">

    .page {
        padding-top: calc(var(--height-navbar) + 20rpx);
        padding-bottom: calc(var(--height-tabbar) + 20rpx);
        
        .orderCard {
            margin: 30rpx 0;
        }
    }
</style>

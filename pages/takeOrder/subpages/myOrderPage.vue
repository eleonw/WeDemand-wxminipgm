<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
		
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
            :order="order" v-if="orderStatusShowMap[order.status]" @buttonClick="buttonClick(index)"> </orderCard>
        <view class="nomore" v-if="nomore">您还没有相关订单</view>
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
  import { orderAssistant_server as orderAssistant } from '@/common/server.js';
  
  let that;
  let _serverListRec;
  
  const tab2Status = {
       0: [orderStatus.ACCEPTED, orderStatus.SERVING, orderStatus.CANCELING, orderStatus.EXCEPTION, 
           orderStatus.EVALUATING, orderStatus.CANCELED, orderStatus.COMPLETED],
       1: [orderStatus.ACCEPTED, orderStatus.SERVING, orderStatus.CANCELING, orderStatus.EXCEPTION],
       2: [orderStatus.EVALUATING],
       3: [orderStatus.CANCELED, orderStatus.COMPLETED],
       4: [orderStatus.EXCEPTION],
  }
    
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
        uni.navigateBack();
      },
      switchTab: function(e) {
        that.nomore = false;
        for (let item in that.orderStatusShowMap) {
            that.orderStatusShowMap[item] = false;
        }
        for (let item of tab2Status[e.index]) {
            that.orderStatusShowMap[item] = true;
        }
      },
      getOrderList: async function(fromStart) {
          if (fromStart) { that.orderList.length = 0; that.nomore = false}
          else if (that.nomore) { uni.showToast({ title: '没有更多订单，请刷新重试', icon:'none'}); return}
          const limit = 2;
          const status = tab2Status[that.tabIndex];
          uni.showLoading();
          const res = await orderAssistant.getServerOrderList({status, limit, _serverListRec, fromStart});
          if (res.success) { 
            _serverListRec = res._serverListRec;
            if (res.orderList.length == 0) { that.nomore = true; }
            that.orderList.push(...res.orderList);
          } else {
            uni.showModal({ content: res.message, showCancel: false});
          }
          uni.hideLoading();
          
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
    beforeMount: async function() {
        await that.getOrderList(true)
        eventBus.$on('reachBottom', async function(){
            that.getOrderList(false);
        })
        eventBus.$on('pullDownRefresh', async function() {
            await that.getOrderList(true);
            that.stopPullDownRefresh();
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

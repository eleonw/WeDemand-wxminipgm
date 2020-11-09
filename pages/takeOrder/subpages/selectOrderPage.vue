<template>
<!-- 	<view class="root page" -->
  <view class="root page">
		<uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
    <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
        :order="order" @buttonClick="takeOrder(index)"></orderCard>
    <view class="nomore" v-if="nomore">还没有新的订单</view>
	</view>
</template>

<script>
  import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
  import orderCard from './../components/orderCard.vue';
  
  import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
  import { orderAssistant_server as orderAssistant } from '@/common/server.js';
  import eventBus from './../eventBus.js';
  import globalEventBus from '@/common/eventBus.js';
  import { orderStatus } from '@/common/globalData.js';
  
  let _createdListRec = null;

  let that;
  let orderId;
  const payEventName = 'takeOrderPay';
    
	export default {
    name: 'selectOrderPage',
    components: { uniNavBar, orderCard },
		data() {
			return {
				orderList: [
          testOrder_HelpBuy,
          testOrder_HelpDeliver,
          testOrder_OtherService
        ],
        nomore: false,
			}
		},
		methods: {
      getOrderList: async function(opt) {
        const { fromStart } = opt;
          const limit = 10;
        if (fromStart) { that.orderList.length=0; that.nomore = false;}
        else if (that.nomore) { uni.showToast({ title: '没有更多订单，请刷新重试', icon:'none'}); return;}
        uni.showLoading();
        let res = await orderAssistant.getCreatedOrderList({fromStart, limit, _createdListRec});
        if (res.success) {
          _createdListRec = res._createdListRec;
          if (res.orderList.length == 0) { that.nomore = true; }
          that.orderList.push(...res.orderList);
        } else {
          uni.showModal({ content: res.message, showCancel: false});
        }
        uni.hideLoading();
      },
      
      takeOrder: function(index) {
        const order = that.orderList[index]
        orderId = order._id;
        if (order.status != orderStatus.CREATED) { return; }
        uni.showModal({
          title: '提示',
          content: '接单需要支付订金，将在订单完成后返还',
          complete: function(e) { 
            if (e.confirm) {
              const paras = 'eventName=' + payEventName + '&amount=' + order.deposit;
              globalEventBus.$on(payEventName, postPay);
              uni.navigateTo({url: '/pages/pay/pay?' + paras});
            }
        }});
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
    created: async function() {
      await that.getOrderList({fromStart: true});
    },
    beforeMount: function() {
      eventBus.$on('reachBottom', async function(){
        await that.getOrderList({fromStart: false});
      })
      eventBus.$on('pullDownRefresh', async function() {
        await that.getOrderList({fromStart: true});
        that.stopPullDownRefresh();
      })
    },
    beforeDestroy: function() {
      eventBus.$off('reachBottom')
      eventBus.$off('pullDownRefresh')
    }
	}
  
  async function postPay(e) {
    eventBus.$off(payEventName);
    if (e.success) {
      uni.showLoading();
      let res = await orderAssistant.take({orderId: orderId});
      uni.showModal({
        content: '您已成功接单，订单编号：' + orderId,
        showCancel: false
      })
    } else {
      uni.showModal({
        content: '支付失败，未成功接单',
        showCancel: false
      })
    }
    that.getOrderList({fromStart: true});
  }
  
</script>

<style lang="scss">
  
    @import "@/common/style/orderListPage.scss";

    .page {
        padding-top: var(--height-navbar);
    }
    
</style>

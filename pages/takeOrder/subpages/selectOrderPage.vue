<template>
<!-- 	<view class="root page" -->
  <view class="root page">
		<uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
    <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
        :order="order" @buttonClick="takeOrder(index)" @cancel="cancelOrder(index)"></orderCard>
    <view class="nomore" v-if="nomore">您还没有相关订单</view>
    <paymentMethodSelector class="selector" v-if="show_paymentMethodSelector" @exit="hideSelector('paymentMethodSelector')" :cost="targetOrder.totalCost"></paymentMethodSelector>
	</view>
</template>

<script>
  import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
  import orderCard from './../components/orderCard.vue';
  import paymentMethodSelector from '@/components/paymentMethodSelector/paymentMethodSelector.vue';
  
  import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
  import { orderAssistant_server as orderAssistant } from '@/common/server.js';
  import eventBus from './../eventBus.js';
  
  let _createdListRec = null;

  let that;
    
	export default {
    name: 'selectOrderPage',
    components: { uniNavBar, orderCard, paymentMethodSelector },
		data() {
			return {
				orderList: [
          testOrder_HelpBuy,
          testOrder_HelpDeliver,
          testOrder_OtherService
        ],
        targetOrder: null,
        show_paymentMethodSelector: false,
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
        that.targetOrder = that.orderList[index];
        uni.showModal({
          title: '提示',
          content: '接单需要支付订金，将在订单完成后返还',
          complete: function(e) { if (e.confirm) { that.show_paymentMethodSelector = true; }}
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
</script>

<style lang="scss">
  
    @import "@/common/style/orderListPage.scss";

    .page {
        padding-top: var(--height-navbar);
    }
    
</style>

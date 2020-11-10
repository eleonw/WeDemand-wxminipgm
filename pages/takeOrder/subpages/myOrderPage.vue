<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
		
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
            :order="order" v-if="orderStatusShowMap[order.status]" @buttonClick="buttonClick(index)"> </orderCard>
        <view class="nomore" v-if="nomore">您还没有相关订单</view>
        
        <confirmCodeInput v-if="show_confirmCodeInput" @exit="exitConfirmCodeInput"></confirmCodeInput>
	</view>
</template>

<script>
  import orderCard from './../components/orderCard.vue';
  import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
  import topTabBar from '@/components/topTabBar/topTabBar.vue';
  import confirmCodeInput from '@/components/confirmCodeInput/confirmCodeInput.vue';
  import eventBus from '../eventBus.js';
  import globalEventBus from '@/common/eventBus.js';
  
  import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js';
  import { orderStatus } from '@/common/globalData.js';
  
  import { promisify } from '@/common/helper.js';
  import { orderAssistant_server as orderAssistant } from '@/common/server.js';
  
  let that;
  let _serverListRec;
  let orderId;
  
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
      orderCard, uniNavBar, topTabBar, confirmCodeInput
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
        show_confirmCodeInput: false,
        
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
        that.getOrderList(false)
      },
      getOrderList: async function(fromStart) {
        if (fromStart) { that.orderList.length = 0; that.nomore = false}
        else if (that.nomore) { uni.showToast({ title: '没有更多订单，请刷新重试', icon:'none'}); return}
        uni.showLoading();
        await that.waitTime(500);
        const limit = 2;
        const status = tab2Status[that.tabIndex];
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
      buttonClick: async function(index) {
        const order = that.orderList[index];
        orderId = order._id;
        switch(order.status) {
          case orderStatus.ACCEPTED: {
            let res = that.promisify(uni.showModal,{title: '提示', content: '开始服务后取消订单需经过对方同意'})
            if (res.cancel) return;
            res = await orderAssistant.start({orderId});
            if (res.success) { await that.promisify(uni.showToast,{title: '操作成功'}); }
            else { await that.promisify(uni.showModal, {title: '提示', content: '操作失败，请重试', showCancel: false})}
            that.getOrderList(true);
            return;
          }
          case orderStatus.SERVING: {
            that.show_confirmCodeInput = true;
            return;
          }
          case orderStatus.EVALUATING: {
            evaluate();
            return;
          }
        }
      },
      exitConfirmCodeInput: async function(e) {
        that.show_confirmCodeInput = false;
        if (!e.valid) return;
        uni.showLoading();
        const confirmCode = e.confirmCode;
        let res = await orderAssistant.finish({orderId, confirmCode});
        if (res.success) { evaluate(orderId) }
        else {
          uni.showModal({title: '提示', content: res.message, showCancel: false})
        }
        that.getOrderList(true);
      } ,
            
      startPullDownRefresh: function() {
        eventBus.$emit('startPullDownRefresh');
      },
      stopPullDownRefresh: function() {
        eventBus.$emit('stopPullDownRefresh');
      },
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
  
  const evalEvent = 'serverEvalOrder';
  function evaluate() {
    const paras = 'eventName=' + evalEvent;
    globalEventBus.$on(evalEvent, postEvaluate);
    uni.navigateTo({url: '/pages/evaluateOrder/evaluateOrder?' + paras});
  }
  
  async function postEvaluate(e) {
    globalEventBus.$off(evalEvent)
    if (!e.success) return;
    uni.showLoading();
    const { comment, score } = e;
    const res = await orderAssistant.evaluate({orderId, comment, score});
    if (res.success) {uni.showToast({title: '评价成功', icon: 'none'})}
    else {uni.showModal({title: '提示', content: res.message })}
    that.getOrderList(true);
  }
   
</script>

<style lang="scss">
    
    @import "@/common/style/orderListPage.scss";
    
    .page {
      padding-top:  calc(var(--height-navbar) + var(--height-toptabbar));
    }
    
</style>

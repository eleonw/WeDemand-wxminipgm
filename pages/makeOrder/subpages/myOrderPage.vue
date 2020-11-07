<template>
	<view class="root page">
    <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
    <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
    
    <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard" 
        :order="order" v-if="orderStatusShowMap[order.status]" @buttonClick="buttonClick(index)" @cancel="cancelOrder(index)"> </orderCard>
    <view class="nomore" v-if="nomore && orderList.length==0">您还没有相关订单</view>
	</view>
</template>

<script>
  import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
  import topTabBar from '@/components/topTabBar/topTabBar.vue';
  import orderCard from './../components/orderCard.vue';
  
  import eventBus from './../eventBus.js';
  import globalEventBus from '@/common/eventBus.js';
  
  import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
  import { orderStatus } from '@/common/globalData.js';
  import shareData from '../shareData.js';
  import { orderAssistant_creater as orderAssistant } from '@/common/server.js';
  
  import { promisify, getMoneyString } from '@/common/helper.js';
  
  const tab2Status = {
     0: [orderStatus.INITIALING, orderStatus.CREATED, orderStatus.ACCEPTED,
        orderStatus.SERVING, orderStatus.CANCELING, orderStatus.EXCEPTION, orderStatus.EVALUATING,
        orderStatus.CANCELED, orderStatus.COMPLETED],
     1: [orderStatus.INITIALING, orderStatus.CREATED],
     2: [orderStatus.ACCEPTED, orderStatus.SERVING, orderStatus.CANCELING, orderStatus.EXCEPTION],
     3: [orderStatus.EVALUATING],
     4: [orderStatus.CANCELED, orderStatus.COMPLETED],
    }
    
  let that;
  let _getListRec;
    
  export default {
    name: 'myOrderPage',
    components: {
        uniNavBar, topTabBar, orderCard
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
            text: '全 部'
          },
          {
            index: 1,
            text: '待服务'
          },
          {
            index: 2,
            text: '进行中'
          },
          {
            index: 3,
            text: '待评价'
          },
          {
            index: 4,
            text: '已结束'
          },
        ],
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
        targetOrder: null,
        nomore: false,
			}
		},
        
    beforeCreate: function() {
        that = this;
    },
    created: async function() {
      await that.getOrderList({fromStart: true});
    },
    beforeMount: async function() {
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
      createOrder: async function(order) {
        const eventName = 'createOrderPay';
        let res = await promisify(uni.showModal, {content: '付款后取消订单将会扣取25%费用', title: '提示'});
        if (res.cancel) return;
        globalEventBus.$on(eventName, async function(e) {
          if (e.success) { res = await orderAssistant.create({orderId: order._id});}
          const paras = 'success' + e.success + "&orderId=" + order._id;
          uni.navigateTo({url:'detailForms/result?' + paras, complete: function(e) {console.log(e)}} );
          that.getOrderList({fromStart:true});
          globalEventBus.$off(eventName);
        })
        const paras = "eventName=" + eventName + "&amount=" + order.totalCost;
        uni.navigateTo({url: '/pages/pay/pay?' + paras});
      },
      
      cancelOrder: async function(index) {
        that.targetOrder = that.orderList[index];
        const order = that.targetOrder;
        let notice;
        switch(order.status) {
          case orderStatus.INITIALING:
              notice = '是否要取消订单'; break;
          case orderStatus.CREATED:
              notice = '频繁地取消订单会影响您的信用评分'; break;
          case orderStatus.ACCEPTED:
              notice = '已接单，取消将扣取25%订金'; break;
          case orderStatus.SERVING:
              notice = '服务中，取消将扣取25%订金,且需对方同意后生效'; break;
          case orderStatus.CANCELING:
              notie = '同意取消订单后您将获取' + getMoneyString(order.deposit) + '的订金'; break;
          default:
              throw new error('not a status for canceling');
        }
        let res = promisify(uni.showToast, {content: notice, icon: 'none'});
        if (res.cancel) {
            return;
        }
        uni.showLoading();
        res = await orderAssistant.cancel({orderId: order._id, status: order.status})
        uni.hideLoading();
        if (res.success) {
            uni.showToast({
                title: '操作成功',
                icon: 'success',
            })
        } else {
            uni.showToast({
                title: res.notice,
                icon: 'none'
            })
        }
        await that.getOrderList({fromStart: true});
      },
      
      buttonClick: async function(index) {
        that.targetOrder = that.orderList[index];
        const order = that.targetOrder;
        switch(order.status) {
          case orderStatus.INITIALING: {
            that.createOrder(order);
          }
          case orderStatus.SERVING: {
            uni.showModal({
              title: '验证码',
              content: order.confirmCode,
              showCancel: false
            })
            break;
          }
          case orderStatus.EVALUATING: {
            const paras = 'orderId=' + order._id + '&side=0';
            uni.navigateTo({
                url: '/pages/evaluateOrder/evaluateOrder?' + paras
            })
            break;
          }
          case orderStatus.CANCELING: {
            that.cancelOrder(index);
            break;
          }
        }
      },
      
      hideSelector: function(type) {
          that['show_'+type] = false;
      },
      
      getOrderList: async function(arg) {
        const { fromStart } = arg;
        if (fromStart) { that.orderList.length = 0; that.nomore = false}
        else if (that.nomore) { uni.showToast({ title: '没有更多订单，请刷新重试', icon:'none'}); return}
        const limit = 10;
        const status = tab2Status[that.tabIndex];
        uni.showLoading();
        const res = await orderAssistant.getUserOrderList({status, limit, _getListRec, fromStart});
        if (res.success) { 
          _getListRec = res._getListRec;
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
        
    
	}

</script>

<style lang="scss">
    
    @import "@/common/style/orderListPage.scss";
    
    .page {
      padding-top:  calc(var(--height-navbar) + var(--height-toptabbar));
    }
    
</style>

<template>
	<view class="root page">
        <uni-nav-bar class="navigationBar" @clickLeft="navigateBack"></uni-nav-bar>
        <topTabBar class="topTabBar" :tabs="tabs" size="35rpx" @switchTab="switchTab"></topTabBar>
		
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
            :order="order" v-if="orderStatusShowMap[order.status]" @buttonClick="buttonClick(index)"> </orderCard>
        
	</view>
</template>

<script>
    import orderCard from '@/components/orderCard/orderCard.vue';
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import topTabBar from '@/components/topTabBar/topTabBar.vue';
    import eventBus from '../../makeOrder/eventBus.js';
    
    import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js';
    import {orderStatus} from '@/common/globalData.js';
    
    import { promisify } from '@/common/helper.js';
    
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
			
		}
	}
</script>

<style>

</style>

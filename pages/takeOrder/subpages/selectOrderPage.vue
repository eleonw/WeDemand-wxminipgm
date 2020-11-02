<template>
	<view class="root page">
        
		<uniNavBar class="navigationBar" @clickLeft="navigateBack"></uniNavBar>
        
        <orderCard v-for="(order,index) in orderList" :key="index" class="orderCard"
            :order="order" @buttonClick="buttonClick(index)"></orderCard>
            
        <view class="loadMore"></view>
		s
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import orderCard from './../components/orderCard.vue';
    
    import { testOrder_HelpDeliver, testOrder_HelpBuy, testOrder_OtherService } from '@/common/classes/Order.js'; 
    
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
                ]
			}
		},
		methods: {
			navigateBack: function() {
                uni.navigateBack()
            }
		},
        beforeCreate: function()  {
            that = this;
            
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

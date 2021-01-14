<template>
	<view class="root page">
        <uni-nav-bar left-icon="none"  title="微叮当"></uni-nav-bar>
        
        <view class="item" @click="navigateTo('makeOrder')">我要下单</view>
        <view class="item" @click="navigateTo('takeOrder')">我帮别人</view>
        <view class="item" @click="navigateTo('me')">我</view>
        
       
       <!-- <view class="grid">
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
            <view class="item"></view>
        </view> -->
       <!-- <itemInfoSelector></itemInfoSelector> -->
      <!-- <seperateTextarea></seperateTextarea> -->
        <!-- <tipSelector></tipSelector> -->
   <!-- <timePicker></timePicker> -->
        <!-- <priceInput></priceInput> -->
        <!-- <paymentMethodSelector></paymentMethodSelector> -->
	</view>	
</template>

<script>
    
    
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    import timePicker from '@/components/timePicker/timePicker.vue';
    import itemInfoSelector from '@/components/itemInfoSelector/itemInfoSelector.vue';
    import seperateTextarea from '@/components/seperateTextarea/seperateTextarea.vue';
    import tipSelector from '@/components/tipSelector/tipSelector.vue';
    import priceInput from '@/components/priceInput/priceInput.vue';
    import paymentMethodSelector from '@/components/paymentMethodSelector/paymentMethodSelector.vue';
    
    import { userInfo } from '@/common/globalData.js';
    
    const pageUrls = {
        makeOrder: '/pages/makeOrder/makeOrder',
        takeOrder: '/pages/takeOrder/takeOrder',
        me: '/pages/me/me'
    }
    
	export default {
        components: {
            uniNavBar,
            timePicker, itemInfoSelector, seperateTextarea, tipSelector, priceInput, paymentMethodSelector
        },
		data() {
			return {
				
			}
		},
    created: async function() {
      let res = await uni.showModal({
        title: '提示',
        content: '由于系统原因，3月前微叮当暂不支持直接提现至微信钱包，对给您造成的不便我们深表歉意。若有提现需求请联系工作人员，具体参见 我>>余额中心>提现',
        showCancel: false
      })
    },
		methods: {
			navigateTo: function(page) {
                uni.navigateTo({
                    url: pageUrls[page],
                })
            },
            
		},
        
        beforeCreate: function() {
            console.log('userInfo')
            console.log(userInfo)
        }
        

	}
</script>

<style>
    
    .page {
        background-color: var(--color-main);
    }
    
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        /* background-color: orange; */
        grid-gap: 10px 10px;
        
        height: 20vw;
    }
    
    .gridItem {
        background-color: var(--color-main);
        text-align: center;
    }
    
    .item {
        font-size: 70rpx;
        text-align: center;
        margin: 30rpx;
        width: 400rpx;
        height: 300rpx;
        line-height: 300rpx;
        color: var(--color-main);
        background-color: white;
        
        border-radius: 30rpx;
    }
</style>

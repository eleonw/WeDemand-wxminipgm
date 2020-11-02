<template>
	<view class="root page">
        <uni-nav-bar left-icon="none"  title="微叮当"></uni-nav-bar>
        
        <view class="item" @click="navigateTo('makeOrder')">我要下单</view>
        <view class="item" @click="navigateTo('takeOrder')">我要接单</view>
        
       
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
		methods: {
			navigateTo: function(page) {
                console.log(page)
                uni.navigateTo({
                    url: pageUrls[page],
                    complete: e => {
                        console.log(e)
                    }
                })
            },
            
		},
        
        onLoad: function() {

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

<template>
	<view class="root page">
        
        <uni-nav-bar left-icon="none"  title="微叮当"></uni-nav-bar>
        
        <view class="grid">
            <view class="gridItem" @click="navigateTo('makeOrder')">
                下单入口
            </view>
            <view class="gridItem" @click="navigateTo('takeOrder')">
                接单入口
            </view>
        </view>
        
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

    
    
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        background-color: orange;
        grid-gap: 10px 10px;
        
        height: 100vw;
    }
    
    .gridItem {
        background-color: blue;
    }
</style>

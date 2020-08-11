<template>
	<view class="root">
    <view class="page">
        
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
       <itemInfoSelector></itemInfoSelector>
      <!-- <seperateTextarea></seperateTextarea>
        <tipSelector></tipSelector> -->
   <timePicker></timePicker>
	</view>	
	</view>
</template>

<script>
    
    import timePicker from '@/components/timePicker/timePicker.vue';
    import itemInfoSelector from '@/components/itemInfoSelector/itemInfoSelector.vue';
    import seperateTextarea from '@/components/seperateTextarea/seperateTextarea.vue';
    import tipSelector from '@/components/tipSelector/tipSelector.vue';
    
	export default {
        components: {
            timePicker, itemInfoSelector, seperateTextarea, tipSelector
        },
		data() {
			return {
				
			}
		},
		methods: {
			toMakeOrder: function() {
                uni.navigateTo({
                    url: '/pages/makeOrder/makeOrder',
                })
            }
		},
        created: function() {

        }
	}
</script>

<style>
/*    .page {
        padding: 10px;
        
        display: flex;
        align-items: stretch;
    }
    
    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        background-color: orange;
        grid-gap: 10px 10px;
        
        height: 100vw;
    }
    
    .item {
        background-color: blue;
    } */
</style>

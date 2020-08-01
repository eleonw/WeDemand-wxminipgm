<template>
	<view class="root">
    <view class="page">
        <view @click="toMakeOrder">校园跑腿</view>
	</view>	
	</view>
</template>

<script>
    
	export default {
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

</style>

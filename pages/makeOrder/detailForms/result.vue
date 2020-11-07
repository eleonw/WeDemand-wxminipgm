<template>
	<view class="root page">
		<view class="success" v-if="success">订单{{orderId}}已成功创建并支付</view>
    <view class="failure" v-else>订单{{orderId}}已成功创建，请在我的订单完成支付</view>
    <view class="confirm" @click="confirm">确认</view>
	</view>
</template>

<script>
  let that;
  
	export default {
    
		data() {
			return {
				success: false,
        orderId: ''
			}
		},
		methods: {
      confirm: function() {
        uni.navigateBack();
      }
		},
    beforeCreate: function() {
      that = this;
    },
    onLoad: function(e) {
      that.success = e.success
      that.orderId = e.orderId;
    }
	}
</script>

<style lang="scss">
  .page {
    background-color: var(--color-main);
    color: white;
    font-size: 55rpx;
    display: flex;
    
    padding-top: 300rpx;
    padding-bottom: 400rpx;
    
    view {
      text-align: center;
      max-width: 700rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .confirm {
      color: var(--color-main);
      background-color: white;
      border-radius: 10rpx;
      width: 200rpx;
      height: 100rpx;
      margin-top: 100rpx;
      font-weight: 700;
    }
  }
</style>

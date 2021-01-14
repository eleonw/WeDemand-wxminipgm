<template>
	<view class="root page">
    <view class="title">请输入新的昵称</view>
    <view class="inputBox">
      <input type="text" maxlength="10" v-model="nickname" class="input"/>
    </view>
    <view class="button" @click="confirm">确认</view>
	</view>
</template>

<script>
  
  import { userInfo } from '@/common/globalData.js';
  import { modifyUserInfo } from '@/common/server.js';
  let that;
  
  
	export default {
		data() {
			return {
				nickname: ''
			}
		},
		methods: {
			confirm: async function() {
        that.nickname = that.nickname.trim();
        if (that.nickname.length == 0) {
          uni.showModal({title: '提示', content: '昵称不能为空', showCancel: false})
          return;
        }
        uni.showLoading({mask:true});
        let res = await modifyUserInfo({update: {nickname: that.nickname}});
        uni.hideLoading();
        if (res.success) {
          userInfo.nickname = that.nickname;
          uni.showModal({content: '操作成功', showCancel: false, completed: function() {uni.navigateBack()}})
        } else {
          uni.showModal({title: '提示', content:'操作失败，请重试', showCancel:false})
        }
      }
		},
    beforeCreate: function() {
      that = this;
    },
    created: function() {
      that.nickname = userInfo.nickname;
    }
    
	}
</script>

<style>
  .page {
    background-color: var(--color-main);
    color: white;
    font-size: 60rpx;
    display:  flex;
    text-align: center;
  }
  
  .title {
    margin-top: 200rpx;
    font-size: 55rpx;
  }
  
  .inputBox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
/*    padding-bottom: 20rpx; */

    width: 400rpx;
    border-bottom: solid 6rpx white;
  }
  
  .input {
    height: 80rpx;
    line-height: 80rpx;
  }
  
  .button {
    
    margin-top: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10rpx;
    width: 150rpx;
    height: 80rpx;
    line-height: 60rpx;
    background-color: white;
    color: var(--color-main);
    
    font-weight: 600;
  }
  
  
</style>

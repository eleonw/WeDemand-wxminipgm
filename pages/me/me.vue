<template>
	<view class="root page">
      
      <view class="item firstItem">
        <view class="title">nickname</view>
        <view class="content">{{userInfo.nickname}}</view>
      </view>
      <view class="item">
        <view class="title">mobile</view>
        <view class="content">{{userInfo.mobile}}</view>
      </view>
      <view class="item lastItem">共完成 {{userInfo.orderCount}} 个订单</view>
      <view class="button" @click="navigateTo('/pages/balanceCenter/index')">余额中心</view>
      <view class="button" @click="navigateTo('/pages/me/modifyUserInfo')">修改信息</view>
      <view class="button" @click="logout">登 出</view>
        
        
	</view>
</template>

<script>
  import { userInfo } from '@/common/globalData.js';
  import { loginAssistant } from '@/common/server.js';
  let that;
    
	export default {
		data() {
			return {
				userInfo: null,
			};
		},
        
    methods: {
      getUserInfoString: function() {
          let res = '';
          for (let item in userInfo) {
              res += item + ':' + userInfo[item] + ';';
          }
          return res;
      },
      
      logout: async function() {
        uni.showModal({
          content: '确定要退出登录吗',
          complete: async function(e) {
            if (e.confirm) {
              const res = await loginAssistant.logout();
              if (res.success) {
                  uni.removeStorageSync('uniIdToken');
                  getApp().globalData.login = false;
                  uni.reLaunch({ url: '/pages/front/front'});
              } else {
                  uni.showToast({
                      title: '登出失败，请重试',
                      icon: 'none'
                  })
              }
            }
          }
        })
      },
          
      navigateTo: function(url) {
          uni.navigateTo({url});
      }
    },
    beforeCreate: function() {
      that = this;
    },
    created: function() {
      that.userInfo = userInfo;
      console.log(that.userInfo)
    }
	}
    
</script>

<style>

    .page {
        background-color: var(--color-main);
        color: white;
        display: flex;
        align-items: center;
        flex-direction: column;
        
    }
    
    .item {
      align-self: flex-start;
      margin-left: 100rpx;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      font-size: 35rpx;
      width: 600rpx;
      color: white;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    }
    
    .title {
      color: var(--color-main);
      background-color: white;
      text-align: center;
      width: 240rpx;
      margin-right: 50rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 10rpx;
    }
    
    .content {
      padding-left: 50rpx;
      border-left: solid 5rpx white;
    }
    
    .firstItem {
      margin-top: 100rpx;
    }
    
    .lastItem {
      margin-bottom: 200rpx;
    }
    
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 45rpx;
        
        border-radius: 10rpx;
        margin: 30rpx;
        width: 200rpx;
        height: 80rpx;
        background-color: white;
        color: var(--color-main);
    }
</style>

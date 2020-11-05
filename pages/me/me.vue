<template>
	<view class="root page">
        
        <view class="button" @click="navigetTo('/pages/balanceCenter/index')">余额中心</view>
        <view class="button" @click="logout">登出</view>
        
        
		{{ getUserInfoString() }}
	</view>
</template>

<script>
    import { userInfo } from '@/common/globalData.js';
    import { loginAssistant } from '@/common/server.js';
    
	export default {
		data() {
			return {
				
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
                                uni.reLaunch({
                                    url: '/pages/front/front',
                                });
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
            
            navigetTo: function(url) {
                uni.navigateTo({url});
            }
        }
	}
    
</script>

<style lang="scss">

    .page {
        background-color: var(--color-main);
        color: white;
        font-size: 40rpx;
        
        display: flex;
        justify-content: flex-end;
        
        padding: 50rpx;
    }
    
    .button {
        margin: 10rpx;
        width: 100rpx;
        height: 60rpx;
        background-color: white;
        color: var(--color-main);
        
    }
</style>

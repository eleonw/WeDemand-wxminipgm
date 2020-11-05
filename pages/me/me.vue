<template>
	<view class="root page">
        
        <view class="logout" @click="logout">登出</view>
        
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
    
    .logout {
        width: 100rpx;
        height: 60rpx;
        background-color: white;
        color: var(--color-main);
        
    }
</style>

<template>
    <view class="root">
	<view class="page">
        使用手机号码登录/注册
        <input v-model="tel"></input>
        <view> {{tel}} </view>
        <button type="default" plain="true" @click="login(0)">使用手机登录</button>
        <button type="default" plain="true" @click="login(1)">使用微信登录</button>
    </view>
    </view>
</template>

<script>
    
    import { promisify, addAll } from '@/common/helper.js';
    import { userInfo } from '@/common/globalData.js';
    import { login } from '@/common/server.js';
    
    let page;
    
	export default {
		data() {
			return {
                tel: '',
			}
		},
		methods: {
            login: async function(type) {
                uni.showLoading({
                    title: '登录中'
                })
                try {
                    let wxCode;
                    
                    const loginData = {type: type};
                    switch (type) {
                        case 0: // login with tel
                            loginData.tel = page.tel;
                            break;
                        case 1:
                            wxCode = (await promisify(wx.login)).code;
                            loginData.wxCode = wxCode;
                            break;
                        default:
                            throw new Error('invalid login type');
                    }
                
                    let res = await login(loginData);
                    addAll.call(userInfo, res);
                    uni.hideLoading();
                } catch(e) {
                    console.log(e);
                    uni.hideLoading();
                    uni.showToast({
                        icon: 'none',
                        title: '登录异常，请重试'
                    })
                }
                
                await page.authorizeLocation();
                uni.redirectTo({
                    url: '/pages/index/index',
                })
            },
            
            authorizeLocation: async function() {
                const res = await promisify(wx.getSetting);
                if (!res.authSetting['scope.userLocation']) {
                    try {
                        await promisify(wx.authorize, {scope: 'scope.userLocation'})
                    } catch (e) {
                        console.log(e);
                    }
                }
                return;
            }
		},
        onLoad: function() {
            page = this;
        }
	}
</script>

<style>
    button {
        width: 95vw;
        margin-left: 2.5vw;

    }

</style>

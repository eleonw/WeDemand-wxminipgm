<template>
    <view class="root page">
        
        <view class="loginArea">
            <view class="title">输入手机号码</view>
            <input class="mobile" v-model="mobile" @input="mobileChange"></input>
        </view>
        <view class="button" @click="loginWithSms">使用手机登录</view>
        
<!--        使用手机号码登录/注册
        <input v-model="mobile" @change="mobileChange"></input>
        <view> {{mobile}} </view>
        
        <view class="button" @click="loginWithSms">使用手机登录</view>
        <view class="button" @click="login(1)">使用微信登录</view> -->
    </view>
</template>

<script>
    
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import inputWithTitle from '@/components/inputWithTitle/inputWithTitle.vue';
    
    import { promisify, addAll } from '@/common/helper.js';
    import { userInfo, dev } from '@/common/globalData.js';
    import { login, sendSmsCode } from '@/common/server.js';
    
    let page;
    
	export default {
        components: {
            uniPopup, inputWithTitle
        },
        
		data() {
			return {
                mobile: '',
			}
		},
        
		methods: {
            mobileChange: function(e) {
                page.mobile = e.detail.value;
            },
            
            loginWithSms: async function() {
                    
                if (page.mobile.length != 11 || isNaN(Number(page.mobile)) || Number(page.mobile)<0) {
                    uni.showToast({
                        title: '手机号码无效，请重试',
                        icon: 'none'
                    })
                    return;
                }
                
                uni.showLoading();
                
                try {
                    let res;
                    if (dev) {
                        res = {
                            code: 0,
                        }
                    } else {
                        res = (await sendSmsCode({
                            mobile: page.mobile,
                            type: 'login'
                        })).result
                    }
                    
                    console.log(res)
                    if (res.code != 0) {
                        throw new Error(res);
                    }
                    uni.hideLoading();
                    uni.navigateTo({
                        url: './fillInSmsCode?mobile=' + this.mobile,
                        complete: e=> {
                            console.log(e)
                        }
                    });
                } catch (e) {
                    console.log(e)
                    uni.hideLoading();
                }
            },
            
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

<style scoped>
    
    .page {
        justify-content: flex-end;
        background-color: var(--color-main);
    }
    
    .loginArea {
        width: 700rpx;
        height: 600rpx;
        background-color: rgba(0, 0 ,0 0.5);
        display: flex;
        align-items: center;
        
        font-size: 40rpx;
        text-align: center;
    }
    
    .title {
        color: white;

        border-radius: 10rpx;
        font-weight: 600;
        padding: 10rpx 30rpx;
        width: 400rpx;
    }
    
    .mobile {
        background-color: white;
        color: var(--color-main);
        height: 50rpx;
        line-height: 50rpx;
        border-radius: 20rpx;
        width: 450rpx;
    }
    
    .button {
        width: 710rpx;
        height: 80rpx;
        color: white;
        
        text-align: center;
        line-height: 80rpx;
        font-size: 50rpx;
        letter-spacing: .1em;
        
        border: 5rpx solid white;
        border-radius: 20rpx;
        
        margin-bottom: 100rpx;
    }

</style>

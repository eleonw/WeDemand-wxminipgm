<template>
	<view class="page">
        使用手机号码登录/注册
        <input v-model="tel"></input>
        <view> {{tel}} </view>
        <button type="default" plain="true" @click="loginWithTel">使用手机登录</button>
        <button type="default" plain="true" @click="loginWithWechat">使用微信登录</button>
    </view>
</template>

<script>
    
    import { promisify } from '@/common/helper.js';
    
    let page;
    
	export default {
		data() {
			return {
                tel: '',
			}
		},
		methods: {
            loginWithTel: async function() {
                console.log(page);
                const res = await uniCloud.callFunction({
                    name: 'login',
                    data: {
                        tel: page.tel,
                    },
                });
            },
            loginWithWechat: async function() {
                try {
                    let res = await promisify(wx.login);
                    console.log(res);
                    res = await uniCloud.callFunction({
                        name: 'login',
                        data: {
                            wxCode: res.code,
                        },
                    });
                    console.log(res);
                    wx.getSetting({
                      success(res) {
                        if (!res.authSetting['scope.userLocation']) {
                          wx.authorize({
                            scope: 'scope.userLocation',
                            complete() {
                                uni.redirectTo({
                                    url: '/pages/makeOrder/makeOrder'
                                })
                            }
                          })
                        }
                      }
                    })
                    
                } catch(e) {
                    console.log(e)
                }
                
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

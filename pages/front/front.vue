<template>
	<view class="page">
        <button type="default" plain="true" @click="login">使用微信登录</button>
    </view>
</template>

<script>
    let vue;
    const app = getApp();
    
	export default {
		data() {
			return {
			}
		},
		methods: {
            login: async function() {
                console.log(app);
                try {
                    let res = await app.wx('login');
                    console.log(res);
                    res = await uniCloud.callFunction({
                        name: 'login',
                        data: res,
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
        onLoad: () => {
            vue = this;
            
        }
	}
</script>

<style>
    button {
        width: 95vw;
        position: absolute;
        left: 2.5vw;
        bottom: 10vh;
    }

</style>

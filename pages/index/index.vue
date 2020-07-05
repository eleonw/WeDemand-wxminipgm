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
        left: 2.5vw
        
    }
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>

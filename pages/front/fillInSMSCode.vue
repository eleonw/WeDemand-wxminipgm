<template>
	<view class="root page">
        
        <statusBar></statusBar>
        
        <uni-icons type="back" class="back" @click="navigateBack" color="white" size="28"></uni-icons>
        
        <view class="notice">已发送短信至{{ mobile }},请填写验证码</view>
        
        <view class="code">
            <!-- {{ code }} -->
            <input class="codeInput" @input="codeChange" maxlength="4"></input>
        </view>
        
        
        <view class="button" @click="confirm">确 认</view>
		
	</view>
</template>

<script>
    
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import statusBar from '@/components/statusBar/statusBar.vue';
    
    import { setUserInfo } from '@/common/helper.js';
    import { loginAssistant, resetSmsCode } from '@/common/server.js';

    const dev = false;
    
    let page;
    
	export default {
        components: {
            statusBar, uniIcons,
        },
		data() {
			return {
                mobile: '',
                focus: true,
                targetIndex: 0,
				code: '',
                completed: [false, false, false, false]
			}
		},
        
        onLoad: function(opt) {
            page.mobile = opt.mobile;

        },
        
        created: function(opt) {
           
            page = this;
            
        },
        
		methods: {
            navigateBack: function() {
                uni.navigateBack();
            },
            
                
            toFocus: function() {
                console.log('focus')
                page.focus = true;
            },
            
            codeChange: function(e) {
                page.code = e.detail.value.toUpperCase()
            },
            
            
            confirm: async function() {
                const mobile = page.mobile;
                const code = page.code;
                const res = await loginAssistant.loginWithSmsCode({mobile, code});
                res.sucess = true
                if (res.success) {
                    console.log('login success');
                    setUserInfo(res.userInfo);
                    console.log(res.userInfo)
                    uni.setStorageSync('uniIdToken', res.token);
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                } else {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    })
                    page.code = '';
                }
            }
		}
	}
</script>

<style lang="scss">
    
    .page {
        background-color: var(--color-main);
    }
    
    .notice {
        margin: 30vh 0 40rpx 0;
        color: white;
        font-size: 35rpx;
        
    }
    
    .input {
        color: transparent;
        position: fixed;
        top: -100px;
        left: -100px;
    }

    .codeArea {
        
        
        width: 70vw;
        
        display: flex;
        flex-flow: row nowrap;
        
        text-align: center;
        justify-content: space-between;
    }
    
    .code {
        
        
        
        width: 200rpx;
        letter-spacing: 5rpx;
        
        border: solid 5rpx white;
        color: white;
        font-size: 60rpx;
        text-align: center;
        
        .codeInput {
          height: 80rpx;
          line-height: 80rpx;
            // color: transparent;
        }
    }
    
    .button {
        /* text-align: center; */
        display: flex;
        justify-content: center;
        height: 80rpx;
        line-height: 80rpx;
        
        /* letter-spacing: 20rpx; */
        font-size: 60rpx;
        
        background-color: white;
        color: var(--color-main);
        font-weight: 600;
        width: 200rpx;
        
        margin-top: 40rpx;
        
        border-radius: 10rpx;
    }
    
    .back {
        position: fixed;
        top: 40rpx;
        left: 20rpx;
    }
    
</style>

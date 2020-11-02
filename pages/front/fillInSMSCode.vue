<template>
	<view class="root page">
        
        <statusBar></statusBar>
        
        <uni-icons type="back" class="back" @click="navigateBack" color="white" size="28"></uni-icons>
        
        <view class="notice">已发送短信至{{ mobile }},请填写验证码</view>
        
            
        <input class="code" v-model="code" maxlength="4"></input>
        
        <view class="button" @click="confirm">确 认</view>
		
	</view>
</template>

<script>
    
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import statusBar from '@/components/statusBar/statusBar.vue';
    
    import { addAll } from '@/common/helper.js';
    import { login, resetSmsCode } from '@/common/server.js';
    import { dev, userInfo } from '@/common/globalData.js';
    
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
            
            page.targetIndex = 0;
            
            if (dev) {
                page.code = 'AAAA'
            }
        },
        
		methods: {
            navigateBack: function() {
                uni.navigateBack();
            },
            
                
            toFocus: function() {
                console.log('focus')
                page.focus = true;
            },
            
            codeChange: function(index) {
                
                if (!page.completed[index] && page.code[index].length == 1) {
                    page.completed[index] = true;
                    page.targetIndex = index + 1;
                } else if (page.completed[index] && page.code[index].length == 0){
                    page.completed[index] = false;
                    if (page.targetIndex != 0) {
                        page.targetIndex = index - 1;
                    }
                }

                if (page.code[index].length == 1) {
                    page.targetIndex = index + 1;
                }
            },
            
            
            confirm: async function() {
                const res = await login({
                    type: 'sms',
                    mobile: page.mobile,
                    code: page.code
                })
                
                console.log(res)
                
                if (res.success) {
                    console.log('login success');
                    addAll.call(userInfo, res.userInfo)
                    console.log(userInfo)
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                }
                
                resetSmsCode({
                    recId: '65825b355f40951900160ef6225676b6'
                });
                
            }
		}
	}
</script>

<style>
    
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
        
        height: 80rpx;
        line-height: 80rpx;
        width: 200rpx;
        
        border: solid 5rpx white;
        color: white;
        font-size: 50rpx;
        text-align: center;
        
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

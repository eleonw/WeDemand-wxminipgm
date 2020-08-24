<template>
	<view class="root page">
        
        <statusBar></statusBar>
        
        <view class="notice">已发送短信至{{mobile}},请填写验证码</view>
        
        <view class="codeArea">
            
            <input v-model="code" maxlength="4" class="input" :focus="focus" confirm-hold="true" hold-keyboard="true"></input>
            <view class="code" @click="toFocus">{{code.length>=1?code[0]:''}}</view>
            <view class="code" @click="toFocus">{{code.length>=2?code[1]:''}}</view>
            <view class="code" @click="toFocus">{{code.length>=3?code[2]:''}}</view>
            <view class="code" @click="toFocus">{{code.length>=4?code[3]:''}}</view>
            

        </view>
		
        <button @click="confirm">确认</button>
	</view>
</template>

<script>
    
    import statusBar from '@/components/statusBar/statusBar.vue'
    
    import { login } from '@/common/server.js';
    
    let page;
    
	export default {
        components: {
            statusBar,
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
            page = this;
            page.mobile = opt.mobile;
            
            page.targetIndex = 0;
        },
        
		methods: {
            
                
            toFocus: function() {
                console.log('aaa')
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
                console.log(this.code)
                // const res = await login({
                //     type: 'SMS',
                //     mobile: mobile,
                //     code: this.code
                // })
            }
		}
	}
</script>

<style>
    
    .notice {
        margin: 30vh 0 40rpx 0;
        
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
        width:60rpx;
        border: 1px solid black;
    }
    
</style>

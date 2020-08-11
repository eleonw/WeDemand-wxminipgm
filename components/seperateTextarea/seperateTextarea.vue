<template>
	<view class="root">
        <view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <view class="back" @click="back">取消</view>
                <view class="title">{{ title }}</view>
                <view class="confirm" @click="confirm">完成</view>
            </view>
            <view class="main">
                <textarea :value="value" placeholder="可填写送货要求及物品描述等信息" class="textarea" maxlength="50" @input="input" />
                <view class="words">{{ value.length + '/50'}} </view>
            </view>
        </view>
		
        
	</view>
</template>

<script>
    let that;
    
	export default {
        name: 'seperateTextarea',
        props: {
            title: {
                type: String,
                default: '填写信息',
            }
        },
		data() {
			return {
                outFlag: false,
                value: ''
			};
		},
        
        created: function() {
            that = this;
        },
        
        methods: {
            input: function(e) {
                this.value = e.detail.value;
            },
            
            fadeOut: function() {
                that.outFlag = true;
                setTimeout(function() {
                    that.outFlag = false;
                }, 1500);
            },
            
            back: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: false,
                    })
                }, 300)
            },
            
            confirm: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: true,
                        value: that.value,
                    })
                }, 300)
            }
        }
	}
</script>

<style scoped>
    @import url("@/common/style/formInputComponent.css");
    
    .textarea {
        width: 85vw;
        height: 200rpx;
        
        border: 1px solid var(--color-border);
        border-radius: 2px;
        
        margin-top: 20rpx;
        padding: 20rpx;
        
        background-color: var(--color-background);
       
    }
    
    .body {
        height: 85vh;
        width: 100vw;
        
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .main {
        display: flex;
        flex-direction: column;
        
        align-items: center;
    }
    
    .words {
        align-self: flex-end;
        
        position: relative;
        bottom: 1.5em;
        right: .5em;
        
       color: #8f8f8f
    }
</style>

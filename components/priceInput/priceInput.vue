<template>
	<view class="root">
		<view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <view class="back" @click="cancel">取消</view>
                <view class="title">{{ title }}</view>
                <view class="confirm" @click="confirm">确认</view>
            </view>
            <view class="main">
                <view class="container"><text class="yuan">￥</text><input :value="value" type="digit" @blur="blur" class="input"></input></view>
                <view class="notice" :class="{showNotice: showNotice}">请输入格式正确的数字</view>
            </view>
        </view>
	</view>
</template>

<script>
    let that;
    
	export default {
        name: 'priceInput',
        props: {
            title: {
                type: String,
                default: '输入金额',
            },
            initalValue: {
                type: String,
                default: ''
            }
        },
		data() {
			return {
                outFlag: false,
				showNotice: false,
                value: null,
			};
		},
        
            
        created: function() {
            that = this;
            
            that.value = that.initialValue;
        },
        
        methods: {
            blur: function(e) {
                that.value = e.detail.value;
                that.processDigit()
            },
            
            processDigit: function() {
                let number = Number(that.value);
                if (isNaN(number)) {
                    that.showNotice = true;
                    return false;
                } else {
                    that.showNotice = false;
                    number = Math.floor(number*10) / 10;
                    that.value = number;
                    return true;
                }
            },
            
            fadeOut: function() {
                that.outFlag = true;
                setTimeout(function() {
                    that.outFlag = false;
                }, 1500);
            },
            
            confirm: async function() {
                
                if (!that.processDigit()) {
                    that.showNotice = false;
                    await new Promise((resolve, reject) => {
                        setTimeout(function() {
                            resolve();
                        })
                    }, 50)
                    that.showNotice = true;
                    return;
                } else {
                    that.fadeOut();
                    setTimeout(function() {
                        that.$emit('exit', {
                            valid: true,
                            value: Number(that.value),
                        });
                    }, 300)
                }
                
            },
            
            cancel: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: false,
                    });
                }, 300)
            
            },
            
        }
	}
</script>

<style>
    
    @import url("@/common/style/formInputComponent.css");
    
    .main {
        min-height: 20vh;
        
        justify-content: center;
    }
    
    .container {
        display: flex;
        flex-flow: row nowrap;
        
        font-size: 60rpx;
        align-items: center;
        justify-content: center;
        
        border: 6rpx solid var(--color-main);
    }
    
    .yuan {
        height: 80rpx;
        line-height: 80rpx;
        
        background-color: var(--color-main);
        color: white;
        
        
    }
    
    .input {
        width: 200rpx;
        
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
    }
    
    .notice {
        opacity: 0;
        color: var(--color-contrast);
    }
    
    .showNotice {
        opacity: 1;
        animation: .5s shakeX;
        
        font-size: .8em;
        
        height: 50rpx;
        line-height: 50rpx;
    }
    
</style>

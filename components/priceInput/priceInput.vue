<template>
	<view class="root">
		<view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <uni-icons type="closeempty" size="24" class="back" @click="cancel"></uni-icons>
                <view class="title">{{ title }}</view>
                <uni-icons type="checkmarkempty" size="24" class="confirm" @click="confirm"></uni-icons>
            </view>
            <view class="main">
                <view class="container"><text class="yuan">￥</text><input v-model="price" type="digit" class="input"></input></view>
                <view class="notice" :class="{showNotice: showNotice}">请输入格式正确的数字</view>
            </view>
        </view>
	</view>
</template>

<script>
    import { getMoneyString, parseMoneyString } from '@/common/helper.js';
    
    let that;
    
    let valueBuffer;
    
	export default {
        name: 'priceInput',
        props: {
            title: {
                type: String,
                default: '输入金额',
            },
            value: {
                type: Number,
                default: 0,
            }
        },
		data() {
			return {
                outFlag: false,
				showNotice: false,
                price: null,
			};
		},
        
            
        created: function() {
            that = this;
            that.price = getMoneyString(that.value);
        },
        
        methods: {
            
            processDigit: function() {
                const res = parseMoneyString(that.price);
                if (isNaN(res)) {
                    that.showNotice = true;
                    return false;
                } else {
                    valueBuffer = res;
                    that.price = getMoneyString(res);
                    that.showNotice = false;
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
                    that.$emit('input', valueBuffer);
                    setTimeout(function() {
                        that.$emit('exit', {
                            valid: true,
                            value: valueBuffer
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

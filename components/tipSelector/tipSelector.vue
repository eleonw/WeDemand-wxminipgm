<template>
	<view class="root">
        <view class="body" :class="{fadeOut: outFlag}">
            <view class="header">
                <uni-icons type="closeempty" size="24" class="back" @click="cancel"></uni-icons>
                <view class="title">小费</view>
                <uni-icons type="checkmarkempty" size="24" class="confirm" @click="confirm"></uni-icons>
            </view>
            <view class="main">
                <view class="value"> {{value}}￥ </view>
                <slider :value="value" min="0" max="15" :activeColor="activeColor" block-size="20" @change="bindChange" class="slider"></slider>
            </view>
        </view>
		
        
        
	</view>
</template>

<script>
    import { color } from '@/common/globalData.js';
    
    let that;
    
	export default {
        name: 'tipSelector',
		data() {
			return {
                outFlag: false,
				value: 0,
                activeColor: null,
			};
		},
        created: function() {
            that = this;
            that.activeColor = color.MAIN;
        },
        methods: {
            bindChange: function(e) {
                that.value = e.detail.value;
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
                    });
                }, 300)
            },
            
            confirm: function() {
                that.fadeOut();
                setTimeout(function() {
                    that.$emit('exit', {
                        valid: true,
                        value: that.value,
                    });
                }, 300)
            }
        }
	}
</script>
    
<style>
    
    @import url('@/common/style/formInputComponent.css');
    
    .body {
        height: 400rpx;
    }
    
    .main {
        height: 100%;
        justify-content: center;
    }
    
    .value {
        font-weight: 500;
        font-size: 50rpx;
        letter-spacing: .2em;
        
        padding: 15rpx;
    }
    
   .slider {
       width: 85vw;
   }
    
</style>

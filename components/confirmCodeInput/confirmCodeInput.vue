<template>
	<view class="root mask">
        <view class="body" :class="{fadeOut: outFlag}">
          <view class="header">
              <uni-icons type="closeempty" size="24" class="back" @click="back"></uni-icons>
              <view class="title">输入验证码</view>
          </view>
          <view class="main">
            <view class="confirmCode">
              <input class="input" type="text" maxlength="6" @input="codeChange">
            </view>
            <view class="button" @click="confirm">确认</view>
          </view>
        </view>
	</view>
</template>

<script>
    import { color } from '@/common/globalData.js';
    import { weightAssistant } from '@/common/helper.js';
    
    let that;
    
	export default {
    name: 'itemInfoSelector',
		data() {
			return {
        confirmCode: '',
        colorMain: color.MAIN,
        outFlag: false,
			};
		},
    methods: {

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
      codeChange: function(e) {
        that.confirmCode = e.detail.value;
      },
      confirm: function() {
        
        that.fadeOut();
        that.$emit('exit', {
          valid: true,
          confirmCode: that.confirmCode,
        });
      }
    },
    
    beforeCreate: function() {
      that = this;
    }
    
	}
</script>

<style scoped>
    
    @import url("@/common/style/formInputComponent.css");
    
    .confirmCode {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-weight: 600;
      width: 280rpx;
      
      border-bottom: solid 6rpx var(--color-main);
      margin-top: 40rpx;
      margin-bottom: 40rpx;
    }
    
    .input {
      color: var(--color-main);
      font-size: 65rpx;
      height: 70rpx;
      line-height: 70rpx;
    }
    
</style>


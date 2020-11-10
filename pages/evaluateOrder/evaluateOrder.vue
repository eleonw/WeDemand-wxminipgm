<template>
	<view class="root page">
    <uni-rate v-model="score" :size="30" class="score"/>
		<view class="comment">  
		    <view class="title">评价一下对方吧</view>
		    <textarea class="textarea"  v-model="comment" placeholder="是否准时,沟通时的态度如何..." maxlength="140"></textarea>
		</view>
    <view class="confirm" @click="confirm">提 交</view>
	</view>
</template>

<script>
  import eventBus from '@/common/eventBus.js';
  let that;
  let eventName;
  
  
	export default {
		data() {
			return {
				score: 0,
        comment: '',
			}
		},
		methods: {
			confirm: async function() {
        const score = that.score;
        const comment = that.comment.trim();
        if (score == 0) {
          uni.showToast({title: '请给对方评分', icon: 'none'})
        } else {
          if (comment.length == 0) {
            const res = await that.promisify(uni.showModal, {
              title: '提示',
              content: '评价可以获取积分，是否确认不评价？',
              confirmText: '去评价',
              cancelText: '确认'
            })
            if (res.confirm) return;
          }
          eventBus.$emit(eventName, {score, comment});
        }
      }
		},
    beforeCreate: function() {
      that = this;
    },
    onLoad: function(e) {
      eventName = e.eventName
    }
    
	}
</script>

<style lang="scss">

  .page {
    align-items: center;
    background-color: var(--color-main);
    color: white;
    
    .score {
      margin-top: 150rpx;
      margin-bottom: 150rpx;
    }
    
    .comment {
      padding: 20rpx;
      border-radius: 20rpx;
      border: solid 10rpx 	#ffbf00;
      background-color: white;
      color: var(--color-main);
      // background-color: orange;
      height: 400rpx;
      width: 650rpx;
      display: flex;
      flex-direction: column;
      
      .title {
        font-size: 50rpx;
        margin-bottom: 20rpx;
      }
      
      .textarea {
        font-size: 40rpx;
      }
    }
    
    .confirm {
      width: 180rpx;
      height: 75rpx;
      line-height: 75rpx;
      
      border: 6rpx solid white;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 55rpx;
      font-weight: 600;
      
      margin-top: 100rpx;
    }
  }

  
   
  
  
  


</style>

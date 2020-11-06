<template>
	<view>
      
    <view v-if="selectedTabIndex==0">
      <selectOrderPage></selectOrderPage>
    </view>
    
    <view v-else>
      <myOrderPage></myOrderPage>
    </view>
    
    <tabBar class="tabBar" :tabs="mainTabs" v-model="selectedTabIndex"></tabBar>
		
	</view>
</template>

<script>
    import tabBar from '@/components/tabBar/tabBar.vue';
    import myOrderPage from './subpages/myOrderPage.vue';
    import selectOrderPage from './subpages/selectOrderPage.vue';
    import eventBus from './eventBus.js';

    let that;
	export default {
    components: {
      myOrderPage, selectOrderPage, tabBar
    },
		data() {
			return {
        selectedTabIndex: 0,
        mainTabs: [
          {
              index: 0,
              text: '新的订单',
              iconPath: '/static/image/icon/home.png',
              selectedIconPath: '/static/image/icon/home_sel.png'
          },
          {
              index: 1,
              text: '我的订单',
              iconPath: '/static/image/icon/me.png',
              selectedIconPath: '/static/image/icon/me_sel.png'
          }
        ],
			}
		},
		methods: {
			enablePullDownRefresh: function(status) {
			    if (status) {
			        eventBus.$on('startPullDownRefresh', () => {
			            uni.startPullDownRefresh();
			        });
			        eventBus.$on('stopPullDownRefresh', () => {
			            uni.stopPullDownRefresh();
			        });
			    } else {
			        eventBus.$off('startPullDownRefresh');
			        eventBus.$off('stopPullDownRefresh');
			    }
			}
		},
        
    onShow: function() {
        that.enablePullDownRefresh(true);
    },
    
    onHide: function() {
        that.enablePullDownRefresh(false);
    },
        
        beforeCreate: function() {
            that = this;
        },
        
        beforeMount: function() {
            that.enablePullDownRefresh(true);
        },
        
        beforeDestroy: function() {
            that.enablePullDownRefresh(false);
        },
        
      onReachBottom: function() {
        eventBus.$emit('reachBottom');
      },
      
      onPullDownRefresh: function() {
        eventBus.$emit('pullDownRefresh');
      }
	}
</script>

<style>

</style>

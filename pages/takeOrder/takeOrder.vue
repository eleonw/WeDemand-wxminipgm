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
			
		}
	}
</script>

<style>

</style>

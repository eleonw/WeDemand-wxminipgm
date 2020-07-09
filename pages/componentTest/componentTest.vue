<template>
	<view class="page">

        <locationCard></locationCard>

        
		<!-- <tabBar :tabItems="tabItems"></tabBar> -->
	</view>
</template>

<script>
    
    import topTabBar from '@/components/topTabBar/topTabBar.vue';
    import tabBar from '@/components/tabBar/tabBar.vue';
    import locationCard from '@/components/locationCard/locationCard.vue'
    
	export default {
        
		data() {
            components: {
                tabBar, topTabBar, locationCard
            }
			return {
                topTabItems: [
                    {
                        index: 0,
                        text: "帮我买"
                    },
                    {
                        index: 1,
                        text: "帮我送"
                    }
                ],
				tabItems: [
				    {
				        index: 0,
				        text: '首页',
				        iconPath: '/static/image/icon/home.png',
				        selectedIconPath: '/static/image/icon/home_sel.png'
				    },
				    {
				        index: 1,
				        text: '订单',
				        iconPath: '/static/image/icon/order.png',
				        selectedIconPath: '/static/image/icon/order_sel.png'
				    },
				    {
				        index: 2,
				        text: '我的',
				        iconPath: '/static/image/icon/me.png',
				        selectedIconPath: '/static/image/icon/me_sel.png'
				    }
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
    .page{
        
        background-color: green;
        height: 100vh;
    }
    
</style>

<template>
	<view class="root page">
		<uniNavBar @clickLeft="clickBack"/>
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
    
	export default {
        components: {
            uniNavBar,
        },
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

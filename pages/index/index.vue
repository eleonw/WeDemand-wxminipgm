<template>
	<view class="root">
    <view class="page">
        
        <timePicker></timePicker>
	</view>	
	</view>
</template>

<script>
    
    import timePicker from '@/components/timePicker/timePicker.vue';
    
	export default {
        components: {
            timePicker,
        },
		data() {
			return {
				
			}
		},
		methods: {
			toMakeOrder: function() {
                uni.navigateTo({
                    url: '/pages/makeOrder/makeOrder',
                })
            }
		},
        created: function() {

        }
	}
</script>

<style>

</style>

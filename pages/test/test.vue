<template>
	<view>
		<textIcon text="是"></textIcon>
	</view>
</template>

<script>
    import textIcon from '@/components/textIcon/textIcon.vue'
    
	export default {
        components: {
            textIcon,
        },
		data() {
			return {
				color: 'green',
                styleObj: {
                    backgroundColor: 'green'
                }
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

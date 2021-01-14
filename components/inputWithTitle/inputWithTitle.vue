<template>
	<view class="root">
		<input type="text" @input="valueChange" :value="value">
            <view class="title">
                {{ title }}
            </view>
        </input>
    </view>
</template>

<script>
	export default {
        name: 'inputWithTitle',
        props: {
            value: {
                type: String,
                default: '',
            },
            title: {
                type: String,
                default: '这是标题',
            }
        },
		data() {
			return {
                
			};
		},
        methods: {
            valueChange: function(e) {
                console.log(e)
                this.$emit('input', e.detail.value);
            }
        }
	}
</script>

<style scoped>
    
    .title {
        position: absolute;
        top: 0;
        left: 0;
    }
    
</style>

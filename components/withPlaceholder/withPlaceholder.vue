<template>
	<view class="viewWithPlaceholder">
        <view class="text" v-if="value!=''">
            {{ value }}
        </view>
		<view class="placeholder" v-else>
            {{ placeholder }}
        </view>
	</view>
</template>

<script>
	export default {
        name: 'viewWithPlaceholder',
        props: {
            placeholder: {
                type: String,
                default: '',
            },
            value: {
                type: String,
                default: '',
            },
            textStyle: {
                type: Object,
                default: {},
            },
            placeholderStyle: {
                type: Object,
                default: {},
            }
        },
		data() {
            return {
                
            }
		}
	}
</script>

<style>
    .placeholder {
        color: #7f7f7f;
    }
</style>

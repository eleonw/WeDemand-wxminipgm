<template>
	<view class="viewWithPlaceholder">
        <view class="text" v-if="content.trim()!=''">
            {{ content + appendix }}
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
            content: {
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
            },
            appendix: {
                type: String,
                default: '',
                required: false
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

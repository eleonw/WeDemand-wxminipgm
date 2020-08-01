<template>
	<view class="root">
    <view class="component" :style="[styleObj]">
       <uni-icons :type="type" :size="size" :color="color" @click="click"></uni-icons>
    </view>
	</view>
</template>

<script>
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
	export default {
        name: 'backgroundIcon',
        components: {
            uniIcons,
        },
        props: {
            type: {
                type: String,
                required: true,
                default: 'back',
            },
            size: {
                type: [Number, String],
                default: 24,
            },
            backgroundColor: {
                type: String,
                default: 'rgba(0, 0, 0, 0.3)'
            },
            color: {
                type: String,
                default: 'white'
            },
            shadow: {
                type: String,
                default: ''
            }
        },
		data() {
			return {
				styleObj: {
                    backgroundColor: null,
                    width: null,
                    height: null,
                    lineHeight: null,
                    boxShadow: null
                }
			};
		},
        methods: {
            click: function() {
                this.$emit('click');
            }
        },
        created: function() {
            this.styleObj.backgroundColor = this.backgroundColor;
            this.styleObj.width = this.styleObj.height = this.styleObj.lineHeight = Math.floor((Number(this.size) * 1.1)) + 'px';
            if (this.shadow == 'true') {
                console.log('tips')
                this.styleObj.boxShadow = '0 0 3px 1px ' + this.backgroundColor;
            }
        }
	}
</script>

<style scoped>
    .component {
        border-radius: 50%;
        
        text-align: center;
    }
</style>

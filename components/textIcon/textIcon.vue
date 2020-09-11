<template>
	<view class="textIcon" :style="[textIconStyle]">
		<view class="text" :style="[textStyle]">{{text}}</view>
	</view>
</template>

<script>
    /**
     * Text Icon 单字图标
     * @description 内部有单个字的圆形图标
     * @param {String} text 图标内部文字
     * @param {String} diameter 图标直径
     * @param {String} backgroundColor 图标颜色
     * @param {String} textColor 文字颜色        
     */
	export default {
        name: 'textIcon',
        props: {
            text: {
                type: String,
                required: true,
                default: '字'
            },
            diameter: {
                type: String,
                default: '1em'
            },
            backgroundColor: {
                type: String,
                default: 'black',
            },
            textColor: {
                type: String,
                default: 'white',
            }
        },
		data() {
            let that = this;
			return {
				textIconStyle: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                    width: that.diameter,
                    height: that.diameter,
                    fontSize: that.diameter,
                    borderRadius: '50%',
                    backgroundColor: that.backgroundColor
                },
                textStyle: {
                    textAlign: 'center',
                    fontSize: '75%',
                    fontWeight: 600,
                    color: that.textColor,
                    
                }
			};
		}
	}
</script>

<style scoped>

</style>

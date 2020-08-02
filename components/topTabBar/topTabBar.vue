<template>
    <view class="root">
    <view class="component" :style="[{'font-size': size}]">
        <view class="tabItem" :style="[activeIndex==item.index?activeStyle:inactiveStyle]" v-for="item in tabs" :key="item.index" @click.stop="switchTab(item.index)">
            {{ item.text }}
        </view>
    </view>
	</view>
</template>

<script>
    
    import { color } from '@/common/globalData.js';
    
	export default {
        name: 'topTabBar',
        props: {
            value: {
                type: [Number, String],
                default: 0
            },
            tabs: {
                type: Array,
                default: []
            },
            size: {
                type: String,
                default: '1em',
            },
            color: {
                type: String,
                default: 'white'
            },
            backgroundColor: {
                type: String,
                default: color.MAIN,
            }
        },
		data() {
			return {
                activeIndex: this.value,
                activeStyle: {
                    fontSize: '1.1em',
                    fontWeight: '600',
                    color: this.backgroundColor,
                    backgroundColor: this.color,
                },
                inactiveStyle: {
                    color: this.color,
                    backgroundColor: this.backgroundColor,
                }

			};
		},
        methods: {
            switchTab(index) {
                this.activeIndex = index;
                this.$emit('switchTab', {index: index});
                this.$emit('input', index);
                console.log('tab change to: ' + index)
            }
        },
        created: function() {
            console.log(this.fontSize)
        }
	}
</script>

<style scoped>

   .component {
        height: var(--height-toptabbar);
        background-color: transparent;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-evenly;
    }
    
    .tabItem {
        padding: .05em .2em;
        
        border-radius: 6rpx;
        
        text-align: center;
        letter-spacing: .1em;
    }
    
    
    
    
</style>

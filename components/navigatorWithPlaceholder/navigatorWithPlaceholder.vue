<template>
    <view class="navigatorWithPlaceholder">
    	<withPlaceholder :content="content" :appendix="appendix" :placeholder="placeholder"></withPlaceholder>
        <uniIcons type="forward"></uniIcons>
    </view>
</template>

<script>
    import withPlaceholder from '@/components/withPlaceholder/withPlaceholder.vue';
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    
    export default {
        name: 'navigatorWithPlaceholder',
        components: {
            withPlaceholder, uniIcons
        },
        props: {
            content: {
                type: String,
                default: '',
                required: true,
            },
            appendix: {
                type: String,
                default: '',
                required: false,
            },
            placeholder: {
                type: String,
                default: '',
                required:true,
            }
        }
    }
</script>

<style>
    .navigatorWithPlaceholder {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
    }
</style>

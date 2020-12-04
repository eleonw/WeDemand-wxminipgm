<script>
    
export default {
    methods: {

    },
    
    globalData: {
        
    },
    
	onLaunch: function() {
        // Object.prototype.clone = function() {
        //     const obj = Object.create(Object.getPrototypeOf(this));
        //     for (let item in this) {
        //         if (item instanceof Object) {
        //             obj[item] = item.clone();
        //         } else {
        //             obj[item] = item;
        //         }
        //     }
        //     return obj;
        // };
    wx.cloud.init()
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
    @import url("/common/style/common.css");
    
    

    /* #ifdef MP-TOUTIAO */
    @font-face {
        font-family: uniicons;
        src: url('/static/uni.ttf');
    }
    /* #endif */
</style>

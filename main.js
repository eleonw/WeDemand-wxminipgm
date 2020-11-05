import Vue from 'vue'
import App from './App'

import { promisify, loginStatusFailure } from '@/common/helper.js';

Vue.config.productionTip = false
Vue.prototype.promsify = promisify;
Vue.prototype.loginStatusFailure = loginStatusFailure;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()




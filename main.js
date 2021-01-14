import Vue from 'vue'
import App from './App'

import { promisify, loginStatusFailure, waitTime } from '@/common/helper.js';

Vue.config.productionTip = false
Vue.prototype.promisify = promisify;
Vue.prototype.loginStatusFailure = loginStatusFailure;
Vue.prototype.waitTime = waitTime;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()




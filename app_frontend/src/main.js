// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Auth from './helpers/auth.js';
import Message from './helpers/message.js';
import Request from './helpers/request.js';
import Quidflow_BG from './helpers/quidflow_bg.js';
// import Quidflow from './helpers/quidflow.js';



Vue.config.productionTip = false;

Vue.use( Auth );
Vue.use( Message );
Vue.use( Request );
Vue.use( Quidflow_BG );
// Vue.use( Quidflow );
// Vue.prototype.a = '123'; // global prop
// Vue.prototype.store = auth; // global prop from module
// Vue.prototype.store1 = plugin.pluginFuncA; // global prop from module

/* eslint-disable no-new */
var vm = new Vue ({
	el: '#app',
	router,
	data : {},
	// data :{ plugin },
	components: { App },
	template: '<App/>'
})




//// console.log( Vue.prototype.store );
// console.log( plugin );
// console.log( Vue.plugin );
// console.log( plugin );

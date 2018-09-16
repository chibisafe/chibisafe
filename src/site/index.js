import Vue from 'vue';

import VueMeta from 'vue-meta';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Buefy from 'buefy';
import VueTimeago from 'vue-timeago';
import VueLazyload from 'vue-lazyload';
import VueAnalytics from 'vue-analytics';
import Clipboard from 'v-clipboard';
import VueIsYourPasswordSafe from 'vue-isyourpasswordsafe';

import router from './router';
import store from './store';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(VueMeta);
Vue.use(VueLazyload);
/*
Vue.use(VueAnalytics, {
	id: 'UA-000000000-0',
	debug: {
		enabled: !isProduction,
		sendHitTask: isProduction
	}
});
*/
Vue.use(VueIsYourPasswordSafe, {
	minLength: 6,
	maxLength: 64
});
Vue.use(VueAxios, axios);
Vue.use(Buefy);
Vue.use(VueTimeago, {
	name: 'timeago',
	locale: 'en-US',
	locales: { 'en-US': require('vue-timeago/locales/en-US.json') }
});
Vue.use(Clipboard);

Vue.axios.defaults.headers.common.Accept = 'application/vnd.lolisafe.json';
// Vue.prototype.$config = require('./config');

export default () => {
	return {
		root: () => import('./App.vue'),
		router,
		store
	};
};

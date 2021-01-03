import Vue from 'vue';
import VueTimeago from 'vue-timeago';

Vue.use(VueTimeago, {
	name: 'timeago',
	locale: 'en-US',
	locales: { 'en-US': require('vue-timeago/locales/en-US.json') }
});

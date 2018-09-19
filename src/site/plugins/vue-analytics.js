import Vue from 'vue';
import VueAnalytics from 'vue-analytics';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(VueAnalytics, {
	id: 'UA-000000000-0',
	debug: {
		enabled: !isProduction,
		sendHitTask: isProduction
	}
});

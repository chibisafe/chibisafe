/*
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);
Vue.axios.defaults.headers.common.Accept = 'application/vnd.lolisafe.json';
*/

export default function({ $axios, redirect }) {
	$axios.onRequest(config => {
		console.log(`Making request to > /${config.url}`);
	});
	$axios.setHeader('accept', 'application/vnd.lolisafe.json');

	$axios.onError(error => {
		// console.log('=====');
		console.log(error);
		// console.log('=====');
		/*
		$toast.open({
			duration: 2500,
			message: 'testing',
			position: 'is-bottom',
			type: error ? 'is-danger' : 'is-success'
		});
		*/
	});
}

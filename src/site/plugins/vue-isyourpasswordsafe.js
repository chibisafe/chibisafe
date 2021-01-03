import Vue from 'vue';
import VueIsYourPasswordSafe from 'vue-isyourpasswordsafe';

Vue.use(VueIsYourPasswordSafe, {
	minLength: 6,
	maxLength: 64
});

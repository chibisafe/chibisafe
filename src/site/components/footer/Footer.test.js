/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Component from './Footer.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Footer.vue', () => {
	const store = new Vuex.Store({
		getters: {
			'auth/isLoggedIn': () => false
		},
		state: {
			config: {}
		}
	});

	it('Should render toshokan as the instance title', () => {
		const wrapper = shallowMount(Component, { store, localVue });

		const title = wrapper.find('h4');
		expect(title.text()).toBe('toshokan');
	});
});

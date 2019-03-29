import Vue from 'vue';
import FlexSearch from 'flexsearch';
const search = new FlexSearch('speed');

// https://github.com/nextapps-de/flexsearch

Vue.prototype.$search = {
	items: async items => {
		await search.clear();
		await search.add(items);
	},
	do: async (term, field) => {
		const results = await search.search(term, { field });
		return results;
	}
};

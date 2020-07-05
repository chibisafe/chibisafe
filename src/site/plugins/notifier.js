export default ({ store }, inject) => {
	inject('notifier', {
		showMessage({ content = '', type = '' }) {
			store.commit('alert/set', { content, color });
		}
	});
};

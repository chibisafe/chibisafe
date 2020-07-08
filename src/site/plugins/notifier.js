import AlertTypes from '~/constants/alertTypes';

export default ({ store }, inject) => {
	inject('notifier', {
		showMessage({ message = '', type = '', snackbar = false }) {
			store.commit('alert/set', { message, type, snackbar });
		},
		message(message, snackbar) {
			this.showMessage({ message, type: AlertTypes.PRIMARY, snackbar });
		},
		info(message, snackbar) {
			this.showMessage({ message, type: AlertTypes.INFO, snackbar });
		},
		warning(message, snackbar) {
			this.showMessage({ message, type: AlertTypes.WARNING, snackbar });
		},
		success(message, snackbar) {
			this.showMessage({ message, type: AlertTypes.SUCCESS, snackbar });
		},
		error(message, snackbar) {
			this.showMessage({ message, type: AlertTypes.ERROR, snackbar });
		},
		types: AlertTypes,
	});
};

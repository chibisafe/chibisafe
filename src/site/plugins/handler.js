import AlertTypes from '~/constants/alertTypes';

export default ({ store }, inject) => {
	inject('handler', {
		async executeAction(action, param) {
			try {
				const response = await store.dispatch(action, param);

				store.commit('alert/set', {
					message: response?.message ?? 'Executed sucesfully',
					type: AlertTypes.SUCCESS
				});

				return response;
			} catch (e) {
				store.commit('alert/set', {
					message: e.message,
					type: AlertTypes.ERROR
				});

				return null;
			}
		}
	});
};

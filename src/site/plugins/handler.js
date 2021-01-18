import AlertTypes from '~/constants/alertTypes';

export default ({ store }, inject) => {
	inject('handler', {
		async executeAction(action, param, showSuccess = true) {
			try {
				const response = await store.dispatch(action, param);

				if (showSuccess) {
					store.commit('alert/set', {
						message: response?.message ?? 'Executed sucesfully',
						type: AlertTypes.SUCCESS
					});
				}

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

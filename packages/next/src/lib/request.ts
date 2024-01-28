import { cookies } from 'next/headers';

const request = {
	checkForToken: () => {
		const cookieStore = cookies();
		const cookie = cookieStore.get('user');

		if (!cookie) {
			return '';
		}

		const { token } = JSON.parse(cookie.value);
		return `Bearer ${token}`;
	},

	parseResponse: async (response: Response) => {
		if (response.status !== 200) {
			const error = await response.json();
			throw new Error(error.message);
		}

		return response.json();
	},

	get: async (url = '', data = {}) => {
		try {
			let queryUrl = `${process.env.BASEAPIURL}${url}`;

			// Check if we are passing any arguments and parse them if so
			if (Object.keys(data).length) {
				queryUrl += `?${new URLSearchParams(data)}`;
			}

			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: request.checkForToken()
					// 'Content-Type': 'application/x-www-form-urlencoded',
				}
			});
			return await request.parseResponse(response);
		} catch (error: any) {
			throw new Error(error.message);
		}
	},

	post: async (url = '', data = {}, headers?: {}) => {
		try {
			const response = await fetch(`/api/${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: request.checkForToken(),
					...headers
				},
				body: JSON.stringify(data)
			});
			return await request.parseResponse(response);
		} catch (error: any) {
			throw new Error(error.message);
		}
	},

	delete: async (url = '', data = {}, headers?: {}) => {
		try {
			const response = await fetch(`/api/${url}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: request.checkForToken(),
					...headers
				},
				body: JSON.stringify(data)
			});
			return await request.parseResponse(response);
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
};

export default request;

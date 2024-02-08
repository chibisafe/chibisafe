const request = {
	parseResponse: async (response: Response) => {
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		const parsed = await response.json();
		if (process.env.NODE_ENV !== 'production') console.log(parsed);
		return parsed;
	},

	get: async (url = '', query = {}, headers?: {}, options?: {}) => {
		try {
			let queryUrl = `${process.env.NEXT_PUBLIC_BASEAPIURL}${url}`;

			// Check if we are passing any arguments and parse them if so
			if (Object.keys(query).length) {
				queryUrl += `?${new URLSearchParams(query)}`;
			}

			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...headers
				},
				...options
			});
			return await request.parseResponse(response);
		} catch (error: any) {
			throw new Error(error.message);
		}
	},

	post: async (url = '', data = {}, headers?: {}) => {
		try {
			let queryUrl = `${process.env.NEXT_PUBLIC_BASEAPIURL}${url}`;

			// This is needed for the set cookies to work with the client apparently
			if (typeof window !== 'undefined') queryUrl = `/api/${url}`;

			const response = await fetch(queryUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: request.checkForToken(),
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
			const queryUrl = `${process.env.NEXT_PUBLIC_BASEAPIURL}${url}`;
			const response = await fetch(queryUrl, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: request.checkForToken(),
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

const request = {
	parseResponse: async (response: Response) => {
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message);
		}

		// if (process.env.NODE_ENV !== 'production') console.log(parsed);
		return response.json();
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

			if (!response.ok) {
				const error = await response.json();
				return {
					error: error.message,
					status: response.status
				};
			}

			return {
				data: await response.json()
			};
		} catch (error) {
			const err = error as Error;
			return {
				error: err.message
			};
		}
	},

	post: async (url = '', data = {}, headers?: {}, options?: {}) => {
		try {
			let queryUrl = `${process.env.NEXT_PUBLIC_BASEAPIURL}${url}`;

			// This is needed for the set cookies to work with the client apparently
			if (typeof window !== 'undefined') queryUrl = `/api/${url}`;

			const response = await fetch(queryUrl, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: request.checkForToken(),
					...headers
				},
				...options,
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const error = await response.json();
				return {
					error: error.message,
					status: response.status
				};
			}

			return {
				data: await response.json()
			};
		} catch (error) {
			const err = error as Error;
			return {
				error: err.message
			};
		}
	},

	delete: async (url = '', data = {}, headers?: {}, options?: {}) => {
		try {
			const queryUrl = `${process.env.NEXT_PUBLIC_BASEAPIURL}${url}`;
			const response = await fetch(queryUrl, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					// Authorization: request.checkForToken(),
					...headers
				},
				...options,
				body: JSON.stringify(data)
			});
			return await request.parseResponse(response);
		} catch {
			// throw new Error(error.message);
		}
	}
};

export default request;

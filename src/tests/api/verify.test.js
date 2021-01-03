/* eslint-disable no-undef */
import { axios } from '../utils';

// This should never succeed as we are not passing a token. We are expecting a 401
test('Verify token', async () => {
	try {
		await axios.get('/api/verify');
		expect(true).toBe(false);
	} catch (err) {
		expect(err.response.status).toBe(401);
	}
});

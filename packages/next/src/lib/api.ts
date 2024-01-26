import { toast } from 'vue-sonner';

import request from '@/lib/request';
import { debug } from '@/lib/utils';

const sendErrorToast = (message: string) => {
	toast.error(message);
};

const sendSuccessToast = (message: string) => {
	toast.success(message);
};

export const getFiles = async (page = 1, limit = 50) => {
	try {
		const data = await request.get(`files?page=${page}&limit=${limit}`);
		debug('getFiles', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

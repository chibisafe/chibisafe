import { toast } from 'vue-sonner';

export default defineNuxtPlugin(() => {
	return {
		provide: {
			toast
		}
	};
});

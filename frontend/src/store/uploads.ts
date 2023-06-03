import { defineStore } from 'pinia';
import type { File } from '@/types';

export const useUploadsStore = defineStore('uploads', {
	state: () => ({
		isUploading: false,
		files: [] as File[]
	}),
	actions: {
		addFile(file: File) {
			this.files.push(file);
		},
		updateProgess(uuid: string, progress: number, bytesSent: number) {
			const file = this.files.find(file => file.uuid === uuid);
			if (file) {
				file.progress = progress;
				file.bytesSent = bytesSent;
			}
		},
		setCompleted(uuid: string, url: string) {
			const file = this.files.find(file => file.uuid === uuid);
			if (file) {
				file.status = 'success';
				file.url = url;
			}
		},
		setError(uuid: string, error: string) {
			const file = this.files.find(file => file.uuid === uuid);
			if (file) {
				file.status = 'error';
				file.error = error;
			}
		}
	}
});

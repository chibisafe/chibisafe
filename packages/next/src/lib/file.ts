import type { File } from '@/types';

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Bytes';

	// If the size is MB add a decimal point
	if (bytes >= 1000000) {
		// eslint-disable-next-line no-param-reassign
		decimals = 1;
	}

	const k = 1000;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const isFileVideo = (file: File | null) => {
	if (!file) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType.startsWith('video/');
};

export const isFileImage = (file: File | null) => {
	if (!file) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType.startsWith('image/');
};

export const isFileAudio = (file: File | null) => {
	if (!file) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType.startsWith('audio/');
};

export const isFilePDF = (file: File | null) => {
	if (!file) return false;
	const { mimeType } = file.fileMetadata;
	return mimeType === 'application/pdf';
};

export const getFileExtension = (name: string) => {
	return name.split('.').pop();
};

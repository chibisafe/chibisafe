import type { FileWithAdditionalData } from '~/types';

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

export const isFileVideo = (file: FileWithAdditionalData) => {
	const { type } = file;
	return type.startsWith('video/');
};

export const isFileImage = (file: FileWithAdditionalData) => {
	const { type } = file;
	return type.startsWith('image/');
};

export const isFileAudio = (file: FileWithAdditionalData) => {
	const { type } = file;
	return type.startsWith('audio/');
};

export const isFilePDF = (file: FileWithAdditionalData) => {
	const { type } = file;
	return type === 'application/pdf';
};

export const isFileZip = (file: FileWithAdditionalData) => {
	const { type } = file;
	return type === 'application/zip' || type === 'application/x-zip-compressed';
};

export const getFileExtension = (file: File) => {
	const { name } = file;
	return name.split('.').pop();
};

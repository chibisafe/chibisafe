import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
import { SETTINGS } from './settings.js';

export const createS3Client = () => {
	const config: S3ClientConfig = {
		region: SETTINGS.S3Region,
		credentials: {
			accessKeyId: SETTINGS.S3AccessKey,
			secretAccessKey: SETTINGS.S3SecretKey
		}
	};

	if (SETTINGS.S3Endpoint) {
		config.endpoint = SETTINGS.S3Endpoint;
	}

	return new S3Client(config);
};

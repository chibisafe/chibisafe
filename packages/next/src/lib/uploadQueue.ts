import PQueue from 'p-queue';

export const uploadQueue = new PQueue({ concurrency: 10 });

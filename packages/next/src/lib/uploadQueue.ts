import PQueue from 'p-queue';

export const uploadQueue: PQueue = new PQueue({ concurrency: 10 });

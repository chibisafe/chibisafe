/* eslint-disable no-bitwise */
// @ts-ignore - no typings for this package
import probe from 'ffmpeg-probe';
import ffmpeg from 'fluent-ffmpeg';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

module.exports = async (opts: any) => {
	const {
		log = noop,

		// general output options
		quality = 2,
		width,
		height,
		input,
		output,

		numFrames,
		numFramesPercent = 0.05
	} = opts;

	const info = await probe(input);
	// const numFramesTotal = parseInt(info.streams[0].nb_frames, 10);
	const { avg_frame_rate: avgFrameRate, duration } = info.streams[0];
	const [frames, time] = avgFrameRate.split('/').map((e: string) => Number.parseInt(e, 10));

	const numFramesTotal = (frames / time) * duration;

	let numFramesToCapture = numFrames || numFramesPercent * numFramesTotal;
	numFramesToCapture = Math.max(1, Math.min(numFramesTotal, numFramesToCapture)) | 0;
	const nthFrame = (numFramesTotal / numFramesToCapture) | 0;

	const result: any = {
		output,
		numFrames: numFramesToCapture
	};

	await new Promise<void>((resolve, reject) => {
		let scale = null;

		if (width && height) {
			result.width = width | 0;
			result.height = height | 0;
			scale = `scale=${width as number}:${height as number}`;
		} else if (width) {
			result.width = width | 0;
			result.height = ((info.height * width) / info.width) | 0;
			scale = `scale=${width as number}:-1`;
		} else if (height) {
			result.height = height | 0;
			result.width = ((info.width * height) / info.height) | 0;
			scale = `scale=-1:${height as number}`;
		} else {
			result.width = info.width;
			result.height = info.height;
		}

		const filter = [`select=not(mod(n\\,${nthFrame}))`, scale].filter(Boolean).join(',');

		ffmpeg(input)
			.outputOptions(['-vsync', 'vfr'])
			.outputOptions(['-q:v', quality, '-vf', filter])
			.noAudio()
			.outputFormat('webm')
			.output(output)
			.on('start', cmd => log?.({ cmd }))
			.on('end', () => resolve())
			.on('error', err => reject(err))
			.run();
	});

	return result;
};

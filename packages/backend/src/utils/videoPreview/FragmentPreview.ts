// @ts-ignore - no typings for this package
import probe from 'ffmpeg-probe';
import ffmpeg from 'fluent-ffmpeg';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const getRandomInt = (min: number, max: number) => {
	const minInt = Math.ceil(min);
	const maxInt = Math.floor(max);

	// eslint-disable-next-line no-mixed-operators
	return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
};

const getStartTime = (
	vDuration: number,
	fDuration: number,
	ignoreBeforePercent: number,
	ignoreAfterPercent: number
) => {
	// by subtracting the fragment duration we can be sure that the resulting
	// start time + fragment duration will be less than the video duration
	const safeVDuration = vDuration - fDuration;

	// if the fragment duration is longer than the video duration
	if (safeVDuration <= 0) {
		return 0;
	}

	return getRandomInt(ignoreBeforePercent * safeVDuration, ignoreAfterPercent * safeVDuration);
};

export default async (opts: any) => {
	const {
		log = noop,

		// general output options
		quality = 2,
		width,
		height,
		input,
		output,

		fragmentDurationSecond = 3,
		ignoreBeforePercent = 0.25,
		ignoreAfterPercent = 0.75
	} = opts;

	const info = await probe(input);

	let { duration } = info.format;
	duration = Number.parseInt(duration, 10);

	const startTime = getStartTime(duration, fragmentDurationSecond, ignoreBeforePercent, ignoreAfterPercent);

	const result: any = { startTime, duration };

	await new Promise((resolve, reject) => {
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

		ffmpeg()
			.input(input)
			.inputOptions([`-ss ${startTime}`])
			.outputOptions(['-vsync', 'vfr'])
			.outputOptions(['-q:v', quality, '-vf', scale])
			.outputOptions([`-t ${fragmentDurationSecond as number}`])
			.noAudio()
			.output(output)
			.on('start', cmd => log?.({ cmd }))
			.on('end', resolve)
			.on('error', reject)
			.run();
	});

	return result;
};

import process from 'node:process';
import schedule from 'node-schedule';
import { log } from '@/main';
import { SETTINGS } from '@/structures/settings';
import { getChibisafeVersion } from '@/utils/Util';

export const updateCheck = {
	active: false,
	updateAvailable: false,
	latestVersion: '',
	latestVersionUrl: '',
	releaseNotes: [] as string[]
};

let updateCheckJob: schedule.Job;

// a > b = true
const versionCompare = (a: string, b: string) => {
	const pa = a.split('.');
	const pb = b.split('.');
	for (let i = 0; i < 3; i++) {
		const na = Number(pa[i]);
		const nb = Number(pb[i]);
		if (na > nb) return true;
		if (nb > na) return false;
		if (!Number.isNaN(na) && Number.isNaN(nb)) return true;
		if (Number.isNaN(na) && !Number.isNaN(nb)) return false;
	}

	return true;
};

export const checkForUpdates = async () => {
	const res = await fetch('https://api.github.com/repos/chibisafe/chibisafe/releases');

	if (!res.ok || res.status !== 200) {
		log.error('Failed to check for updates');
		log.error(await res.json());
		return;
	}

	let releases = await res.json();

	releases = releases.filter(
		(release: { draft: boolean; prerelease: boolean }) => !release.draft && !release.prerelease
	);

	const currentVersion = getChibisafeVersion();
	const latestRelease = releases[0].tag_name.replace('v', '');

	updateCheck.latestVersion = latestRelease;
	updateCheck.latestVersionUrl = releases[0].html_url;

	if (!versionCompare(latestRelease, currentVersion)) {
		updateCheck.updateAvailable = false;
		log.info('No updates available');
		return;
	}

	updateCheck.updateAvailable = true;

	for (const release of releases) {
		const version = release.tag_name.replace(/^v/, '');
		if (version === currentVersion) {
			break;
		}

		updateCheck.releaseNotes.push(`Version ${version}: ${release.body}`);
	}

	log.info(`Update available: ${currentVersion} -> ${latestRelease}`);
};

export const startUpdateCheckSchedule = async () => {
	if (process.env.NODE_ENV !== 'production' || SETTINGS.disableUpdateCheck) return;

	log.debug('Starting update check schedule');

	// Check for updates on startup
	await checkForUpdates();

	updateCheckJob = schedule.scheduleJob(SETTINGS.updateCheckCron, async () => {
		log.info('Checking for updates...');
		return checkForUpdates();
	});

	updateCheck.active = true;
};

export const stopUpdateCheckSchedule = () => {
	log.debug('Stopping update check schedule');
	updateCheckJob?.cancel();

	updateCheck.active = false;
	updateCheck.updateAvailable = false;
	updateCheck.latestVersion = '';
	updateCheck.latestVersionUrl = '';
};

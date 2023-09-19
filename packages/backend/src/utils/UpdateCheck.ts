import process from 'node:process';
import schedule from 'node-schedule';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';
import { getChibisafeVersion } from '@/utils/Util.js';

interface ReleaseNote {
	body: string;
	name: string;
	url: string;
	version: string;
}

export const updateCheck = {
	active: false,
	updateAvailable: false,
	latestVersion: '',
	latestVersionUrl: '',
	releaseNotes: [] as ReleaseNote[]
};

let updateCheckJob: schedule.Job;

const versionCompare = (a: string, b: string) => {
	const pa = a.split('.');
	const pb = b.split('.');
	for (let i = 0; i < 3; i++) {
		const na = Number(pa[i]);
		const nb = Number(pb[i]);
		if (na > nb) return 1;
		if (nb > na) return -1;
		if (!Number.isNaN(na) && Number.isNaN(nb)) return 1;
		if (Number.isNaN(na) && !Number.isNaN(nb)) return -1;
	}

	return 0;
};

const clearUpdate = () => {
	updateCheck.updateAvailable = false;
	updateCheck.latestVersion = '';
	updateCheck.latestVersionUrl = '';
	updateCheck.releaseNotes = [];
};

export const checkForUpdates = async () => {
	const res = await fetch('https://api.github.com/repos/chibisafe/chibisafe/releases');

	if (!res.ok || res.status !== 200) {
		log.error('Failed to check for updates');
		log.error(await res.json());
		clearUpdate();
		return;
	}

	let releases = await res.json();

	releases = releases.filter(
		(release: { draft: boolean; prerelease: boolean }) => !release.draft && !release.prerelease
	);

	const currentVersion = getChibisafeVersion();
	const latestRelease = releases[0].tag_name.replace('v', '');

	updateCheck.updateAvailable = versionCompare(latestRelease, currentVersion) > 0;
	updateCheck.latestVersion = latestRelease;
	updateCheck.latestVersionUrl = releases[0].html_url;
	updateCheck.releaseNotes = [];

	if (!updateCheck.updateAvailable) {
		log.info('No updates available');
		return;
	}

	for (const release of releases) {
		const version = release.tag_name.replace(/^v/, '');

		updateCheck.releaseNotes.push({
			version,
			url: release.html_url,
			name: release.name,
			body: release.body
		});

		if (version === currentVersion) break;
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
	clearUpdate();
};

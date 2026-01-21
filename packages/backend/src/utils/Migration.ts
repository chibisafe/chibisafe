import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const ISSUE_URL = 'https://github.com/chibisafe/chibisafe/issues';
const FAILED_MIGRATION = '20251216120000_restore_save_duplicates_to_album';
const BACKEND_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPO_ROOT = path.resolve(BACKEND_ROOT, '..', '..');
const SCHEMA_PATH = path.resolve(BACKEND_ROOT, 'src/prisma/schema.prisma');
const DATABASE_PATH = path.resolve(REPO_ROOT, 'database/database.sqlite');

const runPrisma = (args: string[], input?: string): string =>
	execFileSync('npx', ['--no-install', 'prisma', ...args], {
		encoding: 'utf-8',
		stdio: 'pipe',
		cwd: BACKEND_ROOT,
		input
	});

const logIssuePrompt = (log: any, context: string): void => {
	log.error(`${context}. Please open a GitHub issue at ${ISSUE_URL}.`);
};

const ensureSqliteDatabasesExist = (log: any): void => {
	const dir = path.dirname(DATABASE_PATH);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
	if (!fs.existsSync(DATABASE_PATH)) {
		fs.closeSync(fs.openSync(DATABASE_PATH, 'a'));
		log.info(`Created SQLite database file: ${DATABASE_PATH}`);
	}
};

const isKnownFailedMigration = (stderr: string): boolean =>
	stderr.includes(FAILED_MIGRATION) && (stderr.includes('P3009') || stderr.includes('P3018'));

const addSettingsColumnIfMissing = (column: string, definition: string): boolean => {
	try {
		runPrisma(
			['db', 'execute', '--schema', SCHEMA_PATH, '--stdin'],
			`ALTER TABLE "settings" ADD COLUMN "${column}" ${definition};`
		);
		return true;
	} catch (error: any) {
		const stderr = error.stderr?.toString() || '';
		if (stderr.includes('duplicate column name') || stderr.includes('already exists')) return false;
		throw error;
	}
};

const detectMissingSettingsColumns = (): string[] => {
	const stdout = runPrisma(
		['db', 'execute', '--schema', SCHEMA_PATH, '--stdin'],
		"SELECT name FROM pragma_table_info('settings') WHERE name IN ('saveDuplicatesToAlbum', 'S3PathStyle');"
	);
	const missing: string[] = [];
	if (!stdout.includes('saveDuplicatesToAlbum')) missing.push('saveDuplicatesToAlbum');
	if (!stdout.includes('S3PathStyle')) missing.push('S3PathStyle');
	return missing;
};

const repairSettingsColumns = (log: any): void => {
	const missing = detectMissingSettingsColumns();
	if (missing.length === 0) return;
	log.warn(`Detected missing settings columns: ${missing.join(', ')}. Repairing...`);
	const added: string[] = [];
	if (missing.includes('saveDuplicatesToAlbum')) {
		if (addSettingsColumnIfMissing('saveDuplicatesToAlbum', 'BOOLEAN NOT NULL DEFAULT false')) {
			added.push('saveDuplicatesToAlbum');
		}
	}
	if (missing.includes('S3PathStyle')) {
		if (addSettingsColumnIfMissing('S3PathStyle', 'BOOLEAN NOT NULL DEFAULT false')) {
			added.push('S3PathStyle');
		}
	}
	if (added.length > 0) log.info(`Repaired settings columns: ${added.join(', ')}`);
};

export const runMigrations = async (log: any): Promise<void> => {
	ensureSqliteDatabasesExist(log);

	try {
		runPrisma(['migrate', 'deploy', '--schema', SCHEMA_PATH]);
		repairSettingsColumns(log);
	} catch (error: any) {
		const stderr = error.stderr?.toString() || '';
		if (!isKnownFailedMigration(stderr)) {
			logIssuePrompt(log, 'Migration failed');
			throw error;
		}

		log.warn(`Detected failed migration ${FAILED_MIGRATION}, auto-resolving...`);
		try {
			repairSettingsColumns(log);
			runPrisma(['migrate', 'resolve', '--applied', FAILED_MIGRATION, '--schema', SCHEMA_PATH]);
			runPrisma(['migrate', 'deploy', '--schema', SCHEMA_PATH]);
			repairSettingsColumns(log);
		} catch (resolveError: any) {
			logIssuePrompt(log, 'Migration auto-resolve failed');
			throw resolveError;
		}
	}

	try {
		runPrisma(['generate', '--schema', SCHEMA_PATH]);
	} catch (error: any) {
		logIssuePrompt(log, 'Prisma client generation failed');
		throw error;
	}
};

import { DashboardHeader } from '@/components/DashboardHeader';
import request from '@/lib/request';
import type { Setting } from '@/types';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/forms/SettingsForm';
import { DiagnosticsDownloadButton } from '@/components/DiagnosticsDownloadButton';

export const metadata: Metadata = {
	title: 'Dashboard - Admin - Settings'
};

export default async function DashboardAdminSettingsServicePage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;
	if (!token) redirect('/');

	const authorization = {
		authorization: `Bearer ${token}`
	};

	const {
		data: response,
		error,
		status
	} = await request.get({
		url: `admin/service/settings`,
		headers: {
			...authorization
		},
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (error && status === 401) {
		redirect('/login');
	}

	const defaultValues = {} as any;

	for (const setting of response.settings) {
		defaultValues[setting.key] = setting.value;
	}

	const categorizedSettings = {
		service: [] as Setting[],
		uploads: [] as Setting[],
		users: [] as Setting[],
		other: [] as Setting[],
		customization: [] as Setting[],
		legal: [] as Setting[]
	};

	for (const setting of response.settings) {
		// @ts-expect-error missing typings
		categorizedSettings[setting.category].push(setting);
	}

	return (
		<>
			<DashboardHeader
				title="Settings"
				subtitle="Manage all your chibisafe settings here"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Settings', url: '/dashboard/admin/settings' }
				]}
			>
				<DiagnosticsDownloadButton />
			</DashboardHeader>
			<div className="px-2 w-full">
				<SettingsForm categorizedSettings={categorizedSettings} defaultValues={defaultValues} />
			</div>
		</>
	);
}

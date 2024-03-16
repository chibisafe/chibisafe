import { DashboardHeader } from '@/components/DashboardHeader';
import { CustomizationForm } from '@/components/forms/settings/CustomizationForm';
import { OtherForm } from '@/components/forms/settings/OtherForm';
import { ServiceForm } from '@/components/forms/settings/ServiceForm';
import { UploadsForm } from '@/components/forms/settings/UploadsForm';
import { UsersForm } from '@/components/forms/settings/UsersForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import request from '@/lib/request';
import type { Setting } from '@/types';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
		if (!defaultValues[setting.category]) {
			defaultValues[setting.category] = {};
		}

		defaultValues[setting.category][setting.key] = setting.value;
	}

	const categorizedSettings = {
		service: [] as Setting[],
		uploads: [] as Setting[],
		users: [] as Setting[],
		other: [] as Setting[],
		customization: [] as Setting[]
	};

	for (const setting of response.settings) {
		// @ts-expect-error missing typings
		categorizedSettings[setting.category].push(setting);
	}

	return (
		<>
			<DashboardHeader
				title="Quarantined files"
				subtitle="Manage quarantined files"
				breadcrumbs={[
					{ name: 'Admin', url: '/dashboard/admin' },
					{ name: 'Quarantined files', url: '/dashboard/admin/quarantine' }
				]}
			/>
			<div className="px-2">
				<Tabs defaultValue="service">
					<TabsList className="mb-4 gap-2">
						<TabsTrigger value="service">Service</TabsTrigger>
						<TabsTrigger value="uploads">Uploads</TabsTrigger>
						<TabsTrigger value="users">Users</TabsTrigger>
						<TabsTrigger value="other">Other</TabsTrigger>
						<TabsTrigger value="customization">Customization</TabsTrigger>
					</TabsList>
					<TabsContent value="service">
						<ServiceForm defaultValues={defaultValues.service} meta={categorizedSettings.service} />
					</TabsContent>
					<TabsContent value="uploads">
						<UploadsForm defaultValues={defaultValues.uploads} meta={categorizedSettings.uploads} />
					</TabsContent>
					<TabsContent value="users">
						<UsersForm defaultValues={defaultValues.users} meta={categorizedSettings.users} />
					</TabsContent>
					<TabsContent value="other">
						<OtherForm defaultValues={defaultValues.other} meta={categorizedSettings.other} />
					</TabsContent>
					<TabsContent value="customization">
						<CustomizationForm
							defaultValues={defaultValues.customization}
							meta={categorizedSettings.customization}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}

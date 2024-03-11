import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChangePassword } from '@/components/ChangePassword';
import { RegenerateApiKey } from '@/components/RegenerateApiKey';
import request from '@/lib/request';
import { cookies } from 'next/headers';
import type { LocalStorageUser, StorageQuota } from '@/types';
import { formatBytes } from '@/lib/file';
import { Progress } from '@/components/ui/progress';
import { CategoryBar } from '@/components/Statistics';

export const metadata: Metadata = {
	title: 'Dashboard - Credentials'
};

export default async function DashboardPage() {
	const cookiesStore = cookies();
	const token = cookiesStore.get('token')?.value;

	const response = await request.get(
		`user/me`,
		{},
		{
			authorization: `Bearer ${token}`
		},
		{
			next: {
				tags: ['me']
			}
		}
	);

	const user = response.user as LocalStorageUser;
	const quota = response.storageQuota as StorageQuota;

	return (
		<>
			<DashboardHeader
				title="Credentials"
				subtitle="Manage your credentials"
				breadcrumbs={[{ name: 'Credentials', url: '/dashboard/account' }]}
			/>
			<div className="px-2">
				<div className="grid grid-cols-[300px,1fr] gap-16">
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label htmlFor="username">Your username</Label>
							<Input name="username" id="username" value={user.username} readOnly />
							<p className="text-[0.8rem] text-muted-foreground">
								Can't be changed, only for display purposes
							</p>
						</div>

						<Separator className="my-4" />

						<ChangePassword />
					</div>
					<div className="flex flex-col">
						<RegenerateApiKey apiKey={user.apiKey} />
						<Separator className="my-4" />
						{quota ? (
							<>
								<span className="text-light-100 block">Storage quota</span>
								<span className="text-light-100 flex flex-col gap-2">
									<CategoryBar
										values={[40, 30, 20, 10]}
										colors={['emerald', 'yellow', 'orange', 'rose']}
										markerValue={quota.quota ? (quota.used / quota.quota) * 100 : 0}
									/>
									<p className="text-[0.8rem] text-muted-foreground">
										Using {formatBytes(quota.used)} of{' '}
										{quota.quota ? formatBytes(quota.quota) : 'unlimited'}
									</p>
								</span>
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}

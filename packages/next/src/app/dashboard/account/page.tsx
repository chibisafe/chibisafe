import type { Metadata } from 'next';

import { DashboardHeader } from '@/components/DashboardHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChangePassword } from '@/components/ChangePassword';

export const metadata: Metadata = {
	title: 'Dashboard - Credentials'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader
				title="Credentials"
				subtitle="Manage your credentials"
				breadcrumbs={[{ name: 'Credentials', url: '/dashboard/account' }]}
			/>
			<div className="px-2">
				<div className="grid grid-cols-[300px,1fr] gap-4">
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label htmlFor="currentpassword">Your username</Label>
							<Input name="username" id="username" readOnly />
							<p className="text-[0.8rem] text-muted-foreground">
								Can't be changed, only for display purposes
							</p>
						</div>

						<Separator className="my-4" />

						<ChangePassword />
					</div>
				</div>
			</div>
		</>
	);
}

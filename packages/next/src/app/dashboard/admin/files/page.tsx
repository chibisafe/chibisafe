import { DashboardHeader } from '@/components/DashboardHeader';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Files" subtitle="Manage all of chibisafe files" />
		</>
	);
}

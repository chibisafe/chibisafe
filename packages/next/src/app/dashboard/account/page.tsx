import { DashboardHeader } from '~/components/DashboardHeader';

export const metadata = {
	title: 'Dashboard - Credentials'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Credentials" subtitle="Manage your credentials" />
		</>
	);
}

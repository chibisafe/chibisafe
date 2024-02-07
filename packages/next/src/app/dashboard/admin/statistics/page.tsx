import { DashboardHeader } from '~/components/DashboardHeader';

export const metadata = {
	title: 'Dashboard - Admin'
};

export default async function DashboardPage() {
	return (
		<>
			<DashboardHeader title="Statistics" subtitle="Your chibisafe instance stats" />
		</>
	);
}

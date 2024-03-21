import { permanentRedirect } from 'next/navigation';

export default async function DashboardAdminPage() {
	return permanentRedirect('/dashboard/admin/settings');
}

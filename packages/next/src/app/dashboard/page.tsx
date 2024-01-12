import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Dashboard'
};

export default async function DashboardPage() {
	// const user = await getCurrentUser();

	// if (!user) {
	// 	redirect(authOptions?.pages?.signIn || '/login');
	// }

	return <div>sup dog</div>;
}

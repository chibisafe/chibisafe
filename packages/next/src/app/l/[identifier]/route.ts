import request from '@/lib/request';
import { redirect } from 'next/navigation';

export async function GET(_: Request, props: { params: Promise<{ identifier: string }> }) {
	const params = await props.params;
	const identifier = params.identifier;
	if (!identifier) {
		return redirect('/404');
	}

	(async () => {
		try {
			await request.get({
				url: `link/${identifier}/count`,
				options: {
					cache: 'no-cache'
				}
			});
		} catch (error) {
			console.error('Failed to update link view count', error);
		}
	})();

	redirect(`/api/link/${identifier}`);
}

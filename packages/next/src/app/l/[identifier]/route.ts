import request from '@/lib/request';
import { redirect } from 'next/navigation';

export async function GET(_: Request, { params }: { params: { identifier: string } }) {
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

	// TODO: https://nextjs.org/blog/next-15-rc#executing-code-after-a-response-with-nextafter-experimental
	redirect(`/api/link/${identifier}`);
}

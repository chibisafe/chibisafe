import request from '@/lib/request';

export const GlobalBackground = async () => {
	const { data, error } = await request.get({
		url: 'v1/settings',
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (error) {
		return null;
	}

	if (data?.siteBackgroundUrl.value) {
		return (
			<div
				className="fixed inset-0 z-[-1] bg-no-repeat bg-center bg-cover"
				style={{ backgroundImage: `url(${data.siteBackgroundUrl.value})` }}
			/>
		);
	}

	return null;
};

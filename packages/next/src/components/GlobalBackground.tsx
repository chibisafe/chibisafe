import request from '@/lib/request';

export const GlobalBackground = async () => {
	const { data, error } = await request.get({
		url: 'settings',
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (error) {
		return null;
	}

	if (data?.backgroundImageURL) {
		return <div className="fixed inset-0 z-[-1]" style={{ background: `url(${data.backgroundImageURL})` }} />;
	}

	return null;
};

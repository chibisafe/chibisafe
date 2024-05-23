import { CustomMDX } from '@/components/mdx/Mdx';
import request from '@/lib/request';
import { notFound } from 'next/navigation';

export function generateMetadata() {
	const section = 'Rules';
	return {
		title: section,
		description: section,
		openGraph: {
			title: section,
			description: section,
			type: 'article',
			images: ['/og']
		},
		twitter: {
			card: 'summary_large_image',
			title: section,
			description: section,
			images: ['/og']
		}
	};
}

export default async function Rules() {
	const { data } = await request.get({
		url: `settings/rulesPageContent`,
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (!data) {
		return notFound();
	}

	return (
		<section>
			<article className="prose">
				<CustomMDX source={data.value} />
			</article>
		</section>
	);
}

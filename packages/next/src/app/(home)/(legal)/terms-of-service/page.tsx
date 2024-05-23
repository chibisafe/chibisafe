import { CustomMDX } from '@/components/mdx/Mdx';
import request from '@/lib/request';
import { notFound } from 'next/navigation';

export function generateMetadata() {
	const section = 'Terms of service';
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

export default async function TermsOfService() {
	const { data } = await request.get({
		url: `settings/termsOfServicePageContent`,
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

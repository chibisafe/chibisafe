import { CustomMDX } from '@/components/mdx/Mdx';
import request from '@/lib/request';
import { notFound } from 'next/navigation';

export function generateMetadata({ params }: { readonly params: { slug: string } }) {
	const title = params.slug === 'terms' ? 'Terms of Service' : params.slug === 'rules' ? 'Rules' : 'Privacy policy';
	return {
		title,
		description: title,
		openGraph: {
			title,
			description: title,
			type: 'article',
			images: ['/og']
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description: title,
			images: ['/og']
		}
	};
}

export default async function Legal({ params }: { readonly params: { slug: string } }) {
	const { data } = await request.get({
		url: `legal/${params.slug}`,
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (!data) {
		return notFound();
	}

	console.log('data', data);

	return (
		<section>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: 'Privacy policy',
						description: 'Privacy policy',
						image: '/og'
					})
				}}
			/>
			<article className="prose">
				<CustomMDX source={data.content} />
			</article>
		</section>
	);
}

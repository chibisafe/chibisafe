import { CustomMDX } from '@/components/mdx/Mdx';
import { getPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
	const posts = getPosts();

	return posts.map(post => ({
		slug: post.slug
	}));
}

export function generateMetadata({ params }: { readonly params: { slug: string } }) {
	const post = getPosts().find(post => post.slug === params.slug);
	if (!post) {
		return;
	}

	const { title, summary: description } = post.metadata;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			images: ['/og?section=guides']
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['/og?section=guides']
		}
	};
}

export default function Guide({ params }: { readonly params: { slug: string } }) {
	const post = getPosts().find(post => post.slug === params.slug);

	if (!post) {
		return notFound();
	}

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
						headline: post.metadata.title,
						description: post.metadata.summary,
						image: post.metadata.image ? post.metadata.image : '/og?section=faq'
					})
				}}
			/>
			<article className="prose">
				<CustomMDX source={post.content} />
			</article>
		</section>
	);
}

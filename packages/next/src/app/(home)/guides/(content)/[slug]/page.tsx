import { CustomMDX } from '@/components/mdx/Mdx';
import { getPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
	const posts = getPosts();

	return posts.map(post => ({
		slug: post.slug
	}));
}

const baseUrl = 'http://localhost:8001';

export function generateMetadata({ params }: { readonly params: { slug: string } }) {
	const post = getPosts().find(post => post.slug === params.slug);
	if (!post) {
		return;
	}

	const { title, summary: description, image } = post.metadata;
	const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			url: `${baseUrl}/blog/${post.slug}`,
			images: [
				{
					url: ogImage
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage]
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
						image: post.metadata.image
							? `${baseUrl}${post.metadata.image}`
							: `/og?title=${encodeURIComponent(post.metadata.title)}`,
						url: `${baseUrl}/guides/${post.slug}`
					})
				}}
			/>
			<article className="prose">
				<CustomMDX source={post.content} />
			</article>
		</section>
	);
}

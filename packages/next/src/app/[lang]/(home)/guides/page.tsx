import Link from 'next/link';
import { getPosts } from '@/lib/mdx';

export const metadata = {
	title: 'Guides',
	description: 'This page includes guides for running and configuring your chibisafe instance.',
	openGraph: {
		title: 'Guides',
		images: ['/og?section=guides']
	},
	twitter: {
		title: 'Guides',
		images: ['/og?section=guides']
	}
};

export default function GuidesPage() {
	const posts = getPosts();
	return (
		<div className="py-6 lg:py-10">
			<div className="space-y-4">
				<h1 className="inline-block font-heading text-4xl lg:text-5xl">{metadata.title}</h1>
				<p className="text-xl text-muted-foreground">{metadata.description}</p>
			</div>
			<hr className="my-4" />
			<div className="grid gap-4 md:grid-cols-2 md:gap-6">
				{posts.map(post => (
					<article
						key={post.slug}
						className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg hover:bg-secondary"
					>
						<div className="flex flex-col justify-between space-y-4">
							<div className="space-y-2">
								<h2 className="text-xl font-medium tracking-tight">{post.metadata.title}</h2>
								<p className="text-muted-foreground">{post.metadata.summary}</p>
							</div>
						</div>
						<Link href={`/guides/${post.slug}`} className="absolute inset-0">
							<span className="sr-only">View</span>
						</Link>
					</article>
				))}
			</div>
		</div>
	);
}

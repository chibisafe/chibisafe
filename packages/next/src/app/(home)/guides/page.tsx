import Link from 'next/link';

export const metadata = {
	title: 'Guides',
	description: 'This section includes guides for running and configuring your chibisafe instance.'
};

export default function GuidesPage() {
	return (
		<div className="py-6 lg:py-10">
			<div className="space-y-4">
				<h1 className="inline-block font-heading text-4xl lg:text-5xl">{metadata.title}</h1>
				<p className="text-xl text-muted-foreground">{metadata.description}</p>
			</div>
			<hr className="my-4" />
			<div className="grid gap-4 md:grid-cols-2 md:gap-6">
				<article className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg hover:bg-secondary">
					<div className="flex flex-col justify-between space-y-4">
						<div className="space-y-2">
							<h2 className="text-xl font-medium tracking-tight">Running chibisafe with Docker</h2>
							<p className="text-muted-foreground">
								Learn to install and run chibisafe in the preferred way
							</p>
						</div>
					</div>
					<Link href="/guides/running-with-docker" className="absolute inset-0">
						<span className="sr-only">View</span>
					</Link>
				</article>
			</div>
		</div>
	);
}

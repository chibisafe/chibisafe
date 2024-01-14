import { FileUploader } from '~/components/FileUploader';

import { siteConfig } from '@/config/site';

export default function Home() {
	return (
		<div className="flex flex-1 flex-col">
			<section className="container px-6 sm:px-8 lg:flex lg:w-full lg:items-center lg:justify-between lg:gap-12">
				<div className="lg:mb-10 lg:w-1/2">
					<div className="lg:mx-auto lg:max-w-2xl">
						<h1 className="text-3xl font-extrabold leading-tight tracking-tighter xs:text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
							{siteConfig.description}
						</h1>
						<p className="xs:text-lg lg:text-xl xl:max-w-xl text-muted-foreground mt-6">
							<span className="text-white">chibisafe</span> is a modern and self-hosted take on file
							uploading services that can handle anything you throw at it thanks to it's robust and fast
							API, chunked uploads support and more.
							<br />
							<br />
							It's easily customizable and deploying your own instance is a breeze.
						</p>
					</div>
				</div>
				<div className="relative -mx-6 mt-6 overflow-hidden p-4 sm:-mx-8 sm:p-8 md:p-10 lg:mt-0 lg:h-[48rem] lg:w-1/2 lg:rounded-l-2xl lg:p-8 flex items-center justify-center">
					<FileUploader />
				</div>
			</section>
		</div>
	);
}

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { SiteFooter } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { DiscordLogo } from '@/components/svg/DiscordLogo';
import { GitHubLogo } from '@/components/svg/GitHubLogo';

interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<Navigation />
					<nav className="flex items-center">
						<Link href="https://discord.gg/5g6vgwn" target="_blank" rel="noreferrer">
							<div
								className={buttonVariants({
									size: 'icon',
									variant: 'ghost'
								})}
							>
								<DiscordLogo className="h-6 w-6" />
								<span className="sr-only">Discord</span>
							</div>
						</Link>

						<Link href="https://github.com/chibisafe/chibisafe" target="_blank" rel="noreferrer">
							<div
								className={buttonVariants({
									size: 'icon',
									variant: 'ghost'
								})}
							>
								<GitHubLogo className="h-6 w-6" />
								<span className="sr-only">GitHub</span>
							</div>
						</Link>

						<Link href="https://patreon.com/pitu" target="_blank" rel="noreferrer">
							<div
								className={buttonVariants({
									size: 'icon',
									variant: 'ghost'
								})}
							>
								<DiscordLogo className="h-6 w-6" />
								<span className="sr-only">Patreon</span>
							</div>
						</Link>

						<Link
							href="/login"
							className={cn(
								buttonVariants({ variant: 'secondary', size: 'sm' }),
								'px-4 ml-4 items-center'
							)}
						>
							Login
						</Link>
					</nav>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}

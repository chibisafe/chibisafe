import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { SiteFooter } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { Icons } from '@/components/icons';

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
						{siteConfig.social.map((link, index) => {
							const IconComponent = Icons[link.icon];
							return (
								<Link href={link.href} target="_blank" rel="noreferrer" key={index}>
									<div
										className={buttonVariants({
											size: 'icon',
											variant: 'ghost'
										})}
									>
										<IconComponent className="h-6 w-6" />
										<span className="sr-only">{link.title}</span>
									</div>
								</Link>
							);
						})}
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

import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { NavigationHome } from '@/components/Header/NavigationHome';
import { Icons } from '@/components/Icons';

const navigation = [
	{
		title: 'Home',
		href: '/'
	},
	{
		title: 'About',
		href: '/about'
	},
	{
		title: 'Docs',
		href: '/docs'
	}
];

const links = [
	{
		title: 'Discord',
		href: 'https://discord.gg/5g6vgwn',
		icon: 'discord'
	},
	{
		title: 'GitHub',
		href: 'https://github.com/chibisafe/chibisafe',
		icon: 'github'
	},
	{
		title: 'Patreon',
		href: 'https://patreon.com/pitu',
		icon: 'patreon'
	}
];

export function HeaderHome() {
	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex gap-6 md:gap-10">
					<Link href="/" className="flex items-center space-x-2">
						<Icons.logo className="h-6 w-6" />
						<span className="inline-block font-bold">{siteConfig.name}</span>
					</Link>

					<NavigationHome />

					<nav className="flex gap-6">
						{navigation?.map((item, index) =>
							item.href ? (
								<Link
									key={index}
									href={item.href}
									className={cn(
										'flex items-center text-sm font-medium text-muted-foreground',
										item.disabled && 'cursor-not-allowed opacity-80'
									)}
								>
									{item.title}
								</Link>
							) : null
						)}
					</nav>
				</div>

				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-1">
						{links.map((link, index) => {
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
					</nav>
				</div>
			</div>
		</header>
	);
}

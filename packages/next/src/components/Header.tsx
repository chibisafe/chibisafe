import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { NavigationUser } from '@/components/NavigationUser';
import { UploadProgress } from '@/components/UploadProgress';
import { DiscordLogo } from '@/components/svg/DiscordLogo';
import { GitHubLogo } from '@/components/svg/GitHubLogo';
import { PatreonLogo } from '@/components/svg/PatreonLogo';

export const Header = () => {
	return (
		<header className="container z-40 bg-background">
			<div className="flex h-20 items-center justify-between py-6">
				<Navigation />
				<UploadProgress />
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
							<PatreonLogo className="h-6 w-6" />
							<span className="sr-only">Patreon</span>
						</div>
					</Link>
					<NavigationUser />
				</nav>
			</div>
		</header>
	);
};

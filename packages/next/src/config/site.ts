export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	url: 'https://chibisafe.moe',
	name: 'chibisafe',
	description: 'Beautiful and performant vault to save all your files in the cloud.',
	navigation: {
		home: [
			{
				title: 'Dashboard',
				href: '/dashboard'
			},
			{
				title: 'Docs',
				href: 'https://chibisafe.moe/docs'
			}
		]
	},
	social: [
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
	],
	links: {
		pitu: 'https://kana.dev',
		github: 'https://github.com/chibisafe/chibisafe'
	}
};

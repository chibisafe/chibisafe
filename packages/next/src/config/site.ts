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
	sidebar: {
		main: [
			{ name: 'Uploads', href: '/dashboard', icon: 'fileUp' },
			{ name: 'Albums', href: '/dashboard/albums', icon: 'library' },
			{ name: 'Tags', href: '/dashboard/tags', icon: 'tags' },
			{ name: 'Snippets', href: '/dashboard/snippets', icon: 'code' }
		],
		account: [{ name: 'Credentials', href: '/dashboard/account', icon: 'key' }],
		admin: [
			{ name: 'Settings', href: '/dashboard/admin/settings', icon: 'settings' },
			{ name: 'Users', href: '/dashboard/admin/users', icon: 'users' },
			{ name: 'Files', href: '/dashboard/admin/files', icon: 'files' },
			{ name: 'Quarantined files', href: '/dashboard/admin/quarantine', icon: 'files' },
			{ name: 'Banned IPs', href: '/dashboard/admin/ip', icon: 'network' },
			{ name: 'Invites', href: '/dashboard/admin/invites', icon: 'userPlus' },
			{ name: 'Statistics', href: '/dashboard/admin/statistics', icon: 'barChart3' }
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

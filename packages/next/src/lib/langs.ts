export const languages = [
	{ lang: 'en', fullName: 'English' },
	{ lang: 'es', fullName: 'Spanish' },
	{ lang: 'de', fullName: 'German' }
];

export const langs = languages.map(({ lang }) => lang);

export type Locales = 'de' | 'en' | 'es';

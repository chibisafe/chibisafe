import 'server-only';

type Locales = 'en' | 'es';
export const locales = ['en', 'es'];

const dictionaries = {
	en: async () => (await import('../dictionaries/en.json')).default,
	es: async () => (await import('../dictionaries/es.json')).default
};

export const getDictionary = async (locale: Locales) => dictionaries[locale]();

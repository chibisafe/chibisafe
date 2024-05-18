import 'server-only';

import type { Locales } from '@/lib/langs';

const dictionaries = {
	en: async () => (await import('../dictionaries/en.json')).default,
	es: async () => (await import('../dictionaries/es.json')).default,
	de: async () => (await import('../dictionaries/de.json')).default
};

export const getDictionary = async (locale: Locales) => dictionaries[locale]();

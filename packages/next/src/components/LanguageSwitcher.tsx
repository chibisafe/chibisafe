'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LanguagesIcon } from 'lucide-react';
import { languages } from '@/lib/langs';
import { usePathname, useRouter } from 'next/navigation';
import { setLanguage } from '@/actions/SetLanguage';

export const LanguageSwitcher = () => {
	const router = useRouter();
	const pathname = usePathname();

	const lang = pathname?.split('/').at(1);
	const currentLanguage = languages.find(l => l.lang === lang);

	const switchLanguage = async (lang: string) => {
		const matchedLanguage = languages.some(l => pathname.startsWith(`/${l.lang}`));
		const newPathname = matchedLanguage
			? pathname.replace(`/${currentLanguage?.lang}`, `/${lang}`)
			: `/${lang}${pathname}`;
		await setLanguage(lang);
		router.push(newPathname);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<LanguagesIcon className="h-6 w-6" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{languages.map(lang => (
					<DropdownMenuItem key={lang.lang} onClick={async () => switchLanguage(lang.lang)}>
						{lang.fullName}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

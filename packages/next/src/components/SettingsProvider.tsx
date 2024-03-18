'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { settingsAtom } from '@/lib/atoms/settings';
import request from '@/lib/request';
import { toast } from 'sonner';

export function SettingsProvider() {
	const [settings, setSettings] = useAtom(settingsAtom);

	useEffect(() => {
		if (!settings) {
			request
				.get({
					url: 'settings',
					options: {
						next: {
							tags: ['me']
						}
					}
				})
				// eslint-disable-next-line promise/prefer-await-to-then
				.then(async response => {
					if (response.error) {
						toast.error(response.error);
						return;
					}

					setSettings(response.data);
				})
				// eslint-disable-next-line promise/prefer-await-to-then
				.catch(() => {});
		}
	}, [settings, setSettings]);

	return null;
}

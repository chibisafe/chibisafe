'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { settingsAtom } from '@/lib/atoms/settings';
import request from '@/lib/request';

export function SettingsProvider() {
	const [settings, setSettings] = useAtom(settingsAtom);

	useEffect(() => {
		if (!settings) {
			request
				.get('settings')
				// eslint-disable-next-line promise/prefer-await-to-then
				.then(response => {
					setSettings(response);
				})
				// eslint-disable-next-line promise/prefer-await-to-then
				.catch(() => {});
		}
	}, [settings, setSettings]);

	return null;
}

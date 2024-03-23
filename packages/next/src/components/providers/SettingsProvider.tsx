'use client';

import { useSetAtom } from 'jotai';

import { settingsAtom } from '@/lib/atoms/settings';
import request from '@/lib/request';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export function SettingsProvider() {
	const setSettings = useSetAtom(settingsAtom);

	useQuery({
		queryKey: ['settings'],
		queryFn: async () => {
			const {
				data: response,
				error,
				status
			} = await request.get({
				url: 'settings',
				options: {
					next: {
						tags: ['settings']
					}
				}
			});

			if (error && status === 401) {
				toast.error(error);
				return;
			}

			setSettings(response);

			return response;
		}
	});

	return null;
}

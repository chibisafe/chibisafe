'use client';
import { UploadCloudIcon } from 'lucide-react';
import { UploadTrigger } from './UploadTrigger';
import { Button } from './ui/react-aria-button';
import { formatBytes } from '@/lib/file';
import type { Settings } from '@/types';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { useAtomValue } from 'jotai';

export const UploadTriggerHomepage = ({ settings }: { readonly settings: Settings }) => {
	const currentUser = useAtomValue(currentUserAtom);

	if (!settings.publicMode && !currentUser?.uuid) {
		return (
			<div className="flex items-center justify-center w-2/3 mt-8">
				Uploading files without an account is currently disabled.
			</div>
		);
	}

	return (
		<UploadTrigger allowsMultiple>
			<div className="flex items-center justify-center w-2/3 global-dropzone-border mt-8">
				<div className="relative h-full w-full rounded-xl hover:bg-[rgb(9,9,121,15%)] transition-colors flex flex-col justify-center items-center">
					<label className="flex flex-col items-center justify-center w-full cursor-pointer">
						<Button className="flex flex-col items-center justify-center pt-5 pb-6">
							<UploadCloudIcon className="h-10 w-10" />
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span className="font-semibold">Click to upload</span> or drag and drop anywhere
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{formatBytes(settings?.maxSize ?? 0)} max per file
							</p>
						</Button>
					</label>
				</div>
			</div>
		</UploadTrigger>
	);
};

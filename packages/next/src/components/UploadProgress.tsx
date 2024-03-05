'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { ExternalLink, Loader2 } from 'lucide-react';

import { uploadsAtom } from '@/lib/atoms/uploads';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Button } from './ui/button';
import { revalidateTag } from 'next/cache';

export const UploadProgress = () => {
	const uploads = useAtomValue(uploadsAtom);
	const [buttonText, setButtonText] = useState('');
	const [filesUploading, setFilesUploading] = useState(0);

	useEffect(() => {
		setFilesUploading(uploads.filter(file => file.processing).length);

		if (filesUploading > 0) {
			setButtonText(`Uploading ${filesUploading} files`);
		} else if (uploads.length > 0) {
			revalidateTag('files');
			setButtonText('All uploads complete');
		} else {
			setButtonText('');
		}
	}, [filesUploading, uploads]);
	return (
		<Popover>
			<PopoverTrigger asChild>
				{buttonText ? (
					<Button variant="outline">
						{filesUploading >= 1 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
						{buttonText}
					</Button>
				) : null}
			</PopoverTrigger>
			<PopoverContent className="w-[512px]">
				<ScrollArea className="w-full h-72">
					<ul className="p-4">
						{uploads.map(file => (
							<li key={file.uuid} className="flex items-center justify-between flex-col mb-4 last:mb-0">
								<div className="flex flex-row w-full justify-between">
									<div className="text-sm font-medium">
										{file.status === 'success' ? (
											<>
												<a
													href={file.url}
													target="_blank"
													rel="noreferrer"
													className="flex items-center gap-1"
												>
													{file.name}
													<ExternalLink className="h-4 w-4 ml-1" />
												</a>
											</>
										) : (
											file.name
										)}
									</div>
									<div className="text-xs text-muted-foreground">
										{file.status === 'error' ? file.error : file.status}
									</div>
								</div>
								<Progress value={file.progress} className="w-full mt-2 h-2" />
							</li>
						))}
					</ul>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
};

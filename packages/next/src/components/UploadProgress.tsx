'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CopyIcon, InfoIcon, Loader2, XIcon } from 'lucide-react';

import { uploadsAtom } from '@/lib/atoms/uploads';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Button } from './ui/button';
import { ProgressBar } from '@tremor/react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCopyToClipboard } from 'usehooks-ts';
import { Label, ProgressBar as ReactAriaProgressBar } from 'react-aria-components';
import { Tooltip } from './Tooltip';

type Status = 'complete' | 'idle' | 'uploading';

export const UploadProgress = () => {
	const [open, setOpen] = useState(false);
	const [uploads, setUploads] = useAtom(uploadsAtom);
	const [buttonText, setButtonText] = useState('');
	const [filesUploading, setFilesUploading] = useState(0);
	const [totalProgress, setTotalProgress] = useState(0);
	const [status, setStatus] = useState<Status>('idle');
	const [_, copy] = useCopyToClipboard();
	const queryClient = useQueryClient();

	const removeFile = (uuid: string) => {
		setUploads(uploads.filter(file => file.uuid !== uuid));
		// TODO: Not entirely sure why the array is not empty after removing the last file
		if (uploads.length === 1) setOpen(false);
	};

	const clearAll = () => {
		setUploads([]);
		setOpen(false);
	};

	const copyAllLinks = () => {
		const links = uploads.map(file => file.url).join('\n');
		void copy(links);
	};

	useEffect(() => {
		setFilesUploading(uploads.filter(file => file.processing).length);
		let timeout: NodeJS.Timeout;

		if (filesUploading > 0) {
			setStatus('uploading');
			setButtonText(`Uploading ${filesUploading} file${filesUploading === 1 ? '' : 's'}`);
			setTotalProgress(
				uploads.filter(file => file.status !== 'error').reduce((acc, file) => acc + file.progress, 0) /
					uploads.length
			);
		} else if (uploads.length > 0) {
			setStatus('complete');
			setButtonText('All uploads complete 🎉');
			timeout = setTimeout(() => {
				let queryKey = ['uploads'];
				const albumUpload = uploads.find(file => file.albumUuid);
				if (albumUpload) {
					queryKey = ['album', albumUpload.albumUuid!];
				}

				void queryClient.invalidateQueries({ queryKey });
			}, 1000);
		} else {
			setStatus('idle');
			setButtonText('');
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [filesUploading, queryClient, uploads]);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{buttonText ? (
					<Button
						variant="default"
						className={cn('transition-all', status === 'uploading' ? 'flex-col gap-2 py-8' : '')}
					>
						{status === 'uploading' ? (
							<>
								<ProgressBar value={totalProgress} color="blue" className="max-w-sm w-80" />
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							</>
						) : null}
						{buttonText}
					</Button>
				) : null}
			</PopoverTrigger>
			<PopoverContent className="w-[512px] mt-2">
				{uploads.length > 1 ? (
					<div className="flex flex-row gap-2 text-sm justify-end mb-4">
						<Button size="sm" variant="outline" onClick={() => copyAllLinks()}>
							Copy all links
						</Button>
						<Button size="sm" variant="outline" onClick={() => clearAll()}>
							Clear all
						</Button>
					</div>
				) : null}
				<ScrollArea className="w-full h-72">
					<ul className="">
						{uploads.map(file => (
							<li key={file.uuid} className="flex items-center justify-between flex-col mb-4 last:mb-0">
								<ReactAriaProgressBar
									value={file.progress}
									className="flex flex-col gap-3 w-full text-white"
									aria-label="File progress bar"
								>
									{({ percentage, valueText }) => (
										<>
											<div className="flex text-sm">
												{file.status === 'uploading' ? (
													<>
														<Label className="flex-1">Uploading {file.name}...</Label>
														<span>{valueText}</span>
													</>
												) : file.status === 'success' ? (
													<div className="flex justify-between flex-1 gap-4 items-center">
														<a
															href={file.url}
															target="_blank"
															rel="noopener noreferrer"
															className="link flex items-center gap-1"
														>
															{file.name}
														</a>
														<div className="flex">
															<Tooltip content="Copy link">
																<Button
																	variant="ghost"
																	size="icon"
																	className="w-6 h-6"
																	onClick={() => void copy(file.url ?? '')}
																>
																	<CopyIcon className="h-4 w-4" />
																</Button>
															</Tooltip>

															<Tooltip content="Remove from list">
																<Button
																	variant="ghost"
																	size="icon"
																	className="w-6 h-6"
																	onClick={() => removeFile(file.uuid)}
																>
																	<XIcon className="h-4 w-4" />
																</Button>
															</Tooltip>
														</div>
													</div>
												) : file.status === 'error' ? (
													<div className="flex justify-between flex-1">
														{file.name}
														<div className="flex">
															<Tooltip
																content={file.error ?? 'An unexpected error ocurred'}
															>
																<InfoIcon className="h-4 w-4 text-red-500" />
															</Tooltip>
														</div>
													</div>
												) : null}
											</div>
											<div className="h-2 top-[50%] transform translate-y-[-50%] w-full rounded-full bg-white bg-opacity-40">
												<div
													className={cn(
														'absolute h-2 top-[50%] transform translate-y-[-50%] rounded-full',
														file.error ? 'bg-red-500' : 'bg-white'
													)}
													style={{ width: percentage + '%' }}
												/>
											</div>
										</>
									)}
								</ReactAriaProgressBar>
							</li>
						))}
					</ul>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
};

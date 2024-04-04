'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { setQuota } from '@/actions/UserTableActions';
import { formatBytes } from '@/lib/file';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export function SetQuotaDrawer({
	className,
	initialValue,
	uuid
}: {
	readonly className?: string;
	readonly initialValue: number;
	readonly uuid: string;
}) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(setQuota, {
		message: '',
		type: MessageType.Uninitialized
	});
	const [bytes, setBytes] = useState(initialValue);

	useEffect(() => {
		if (state.type === MessageType.Error) toast.error(state.message);
		else if (state.type === MessageType.Success) {
			toast.success(state.message);
			setOpen(false);
		}

		return () => {
			if (state.type === MessageType.Success) {
				state.type = MessageType.Uninitialized;
				state.message = '';
			}
		};
	}, [state, state.message, state.type]);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<button type="button" className={cn('w-full h-full flex p-0 cursor-default', className)}>
					Set quota
				</button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">Set Quota</h2>
					<p className="text-sm text-muted-foreground">Define how much space this user has available</p>
				</div>

				<form action={formAction}>
					<input type="hidden" name="uuid" value={uuid} />
					<div className="grid gap-4 py-4 px-8">
						<div className="grid gap-4">
							<div>
								<Label htmlFor="name">Space (in kb)</Label>
								<Input
									name="space"
									id="space"
									type="number"
									value={bytes}
									required
									min={0}
									max={999999999999990}
									onChange={e => setBytes(Number.parseInt(e.target.value, 10) || 0)}
								/>
								<p className="text-muted-foreground text-sm">{formatBytes(bytes)}</p>
							</div>
						</div>
						<Button type="submit" className="mb-4 w-full">
							Set
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}

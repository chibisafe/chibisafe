'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatBytes } from '@/lib/file';
import { setQuota } from '@/actions/UserTableActions';
import { cn } from '@/lib/utils';

export function SetQuotaDialog({
	className,
	initialValue,
	uuid
}: PropsWithChildren<{ readonly className?: string; readonly initialValue: number; readonly uuid: string }>) {
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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button type="button" className={cn('w-full h-full flex p-0 cursor-default', className)}>
					Set quota
				</button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<form action={formAction}>
					<input type="hidden" name="uuid" value={uuid} />
					<DialogHeader>
						<DialogTitle>Set Quota</DialogTitle>
						<DialogDescription>Define how much space this user has available</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mb-4">
						<div className="grid gap-4 mt-4">
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
					</div>
					<DialogFooter>
						<Button type="submit">Set</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

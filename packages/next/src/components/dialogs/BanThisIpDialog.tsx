'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Trash2Icon } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { banIp } from '@/actions/IpActions';

export function BanThisIpDialog({ ip }: PropsWithChildren<{ readonly ip: string }>) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(banIp, {
		message: '',
		type: MessageType.Uninitialized
	});

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
	}, [router, state, state.message, state.type]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'destructive'}>
					<Trash2Icon className="mr-2 h-4 w-4" />
					Ban this IP
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form action={formAction}>
					<input type="hidden" name="ip" value={ip} />
					<DialogHeader>
						<DialogTitle>Ban this IP</DialogTitle>
						<DialogDescription>
							The IP <strong>{ip}</strong> will be banned. You sure you want to continue?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type="submit">Confirm</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

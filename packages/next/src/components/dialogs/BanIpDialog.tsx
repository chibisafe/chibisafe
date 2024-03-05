'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
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
import { banIp } from '@/actions/IpActions';

export function BanIpDialog() {
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
	}, [state, state.message, state.type]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Ban new IP
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>Ban new IP</DialogTitle>
						<DialogDescription>
							The IP you submit in the field below will be denied access to the platform until you remove
							the ban. Be careful
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="input" className="text-right">
								IP
							</Label>
							<Input id="ip" name="ip" placeholder="127.0.0.69" className="col-span-3" />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Submit</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

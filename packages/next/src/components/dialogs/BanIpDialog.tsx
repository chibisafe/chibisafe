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
import { Textarea } from '../ui/textarea';

export function BanIpDialog({ className }: { readonly className?: string }) {
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
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					Ban new IP
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>Ban new IP</DialogTitle>
						<DialogDescription>
							The submitted IP will be banned and won't be able to use the service until unbanned.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mb-4">
						<div className="grid gap-4 mt-4">
							<div>
								<Label htmlFor="ip">IP</Label>
								<Input id="ip" name="ip" placeholder="127.0.0.69" className="col-span-3" />
							</div>
							<div>
								<Label htmlFor="reason">Reason</Label>
								<Textarea
									id="reason"
									name="reason"
									placeholder="Reason for ban"
									className="col-span-4"
								/>
							</div>
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

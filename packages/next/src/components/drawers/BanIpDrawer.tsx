'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { banIp } from '@/actions/IpActions';
import { Textarea } from '../ui/textarea';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export function BanIpDrawer({ className }: { readonly className?: string }) {
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
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					Ban new IP
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">Ban new IP</h2>
					<p className="text-sm text-muted-foreground">
						The submitted IP will be banned and won't be able to use the service until unbanned.
					</p>
				</div>

				<form action={formAction}>
					<div className="grid gap-4 py-4 px-8">
						<div className="grid gap-4">
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
						<Button type="submit" className="mb-4 w-full">
							Submit
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}

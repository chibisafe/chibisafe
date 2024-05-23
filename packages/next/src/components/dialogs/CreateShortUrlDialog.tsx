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
import { createShortURL } from '@/actions/LinksActions';
import { Callout } from '../mdx/Callout';

export function CreateShortUrlDialog({ className }: { readonly className?: string }) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(createShortURL, {
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
					Create short URL
				</Button>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>New short URL</DialogTitle>
						<DialogDescription>
							This will create a new short URL that will redirect to the specified destination.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 mb-4">
						<div className="grid gap-4 mt-4">
							<div>
								<Label htmlFor="url">Destination</Label>
								<Input
									id="url"
									name="url"
									placeholder="https://chibisafe.app"
									className="col-span-3"
									required
								/>
							</div>
							<div>
								<Label htmlFor="vanity">Custom URL</Label>
								<Input
									id="vanity"
									name="vanity"
									placeholder="MySuperCustomUrl"
									className="col-span-3"
								/>
								<Callout type="warning">
									<p className="text-sm">
										You can specify a custom URL for your short URL. If the custom URL is already
										taken or you don't provide a value, a random one will be generated.
									</p>
								</Callout>
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

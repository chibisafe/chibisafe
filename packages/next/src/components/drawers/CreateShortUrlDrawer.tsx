'use client';

import { useEffect, useState } from 'react';
import { MessageType } from '@/types';
import { Plus } from 'lucide-react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createShortURL } from '@/actions/LinksActions';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Callout } from '../mdx/Callout';

export function CreateShortUrlDrawer({ className }: { readonly className?: string }) {
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
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className={className}>
					<Plus className="mr-2 h-4 w-4" />
					Create short URL
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="grid gap-1.5 py-4 px-8 text-center sm:text-left">
					<h2 className="text-lg font-semibold leading-none tracking-tight">New short URL</h2>
					<p className="text-sm text-muted-foreground">
						This will create a new short URL that will redirect to the specified destination.
					</p>
				</div>

				<form action={formAction}>
					<div className="grid gap-4 py-4 px-8">
						<div className="grid gap-4">
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
						<Button type="submit" className="mb-4 w-full">
							Submit
						</Button>
					</div>
				</form>
			</DrawerContent>
		</Drawer>
	);
}

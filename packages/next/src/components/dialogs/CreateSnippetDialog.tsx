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
import { Textarea } from '../ui/textarea';
import { supportedLanguages } from '@/lib/snippets';
import { Combobox } from '../Combobox';
import { createSnippet } from '@/actions/SnippetActions';

export function CreateSnippetDialog() {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(createSnippet, {
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
					New snippet
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] w-full">
				<form action={formAction}>
					<DialogHeader>
						<DialogTitle>New snippet</DialogTitle>
						<DialogDescription>Create a new snippet here</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input name="name" id="name" />
							</div>
							<div>
								<Label htmlFor="language">Language</Label>
								<Combobox data={supportedLanguages} />
							</div>
						</div>

						<Textarea
							placeholder="Write your thoughts here..."
							className="h-96"
							name="content"
							id="content"
						/>
					</div>
					<DialogFooter>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

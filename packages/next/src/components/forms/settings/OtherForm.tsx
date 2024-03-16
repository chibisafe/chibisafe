'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import type { PropsWithChildren } from 'react';
import type { Setting } from '@/types';
import { FormWrapper } from './FormWrapper';

const formSchema = z.object({
	generateZips: z.boolean().optional(),
	generatedAlbumLength: z.coerce.number()
});

type FormValues = z.infer<typeof formSchema>;

export function OtherForm({
	defaultValues,
	meta
}: PropsWithChildren<{ readonly defaultValues: Partial<FormValues>; readonly meta: Setting[] }>) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onChange'
	});

	function onSubmit(data: FormValues) {
		toast.success(
			<>
				<pre>
					<code>{JSON.stringify(data, null, 2)}</code>
				</pre>
			</>
		);
	}

	return <FormWrapper form={form} meta={meta} onSubmit={onSubmit} />;
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import type { PropsWithChildren } from 'react';
import type { Setting } from '@/types';
import { FormWrapper } from './FormWrapper';

const formSchema = z.object({
	serveUploadsFrom: z.string().optional(),
	rateLimitWindow: z.coerce.number(),
	rateLimitMax: z.coerce.number(),
	secret: z.string(),
	disableUpdateCheck: z.boolean().optional()
});

type FormValues = z.infer<typeof formSchema>;

export function ServiceForm({
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

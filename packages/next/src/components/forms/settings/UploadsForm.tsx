'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import type { PropsWithChildren } from 'react';
import type { Setting } from '@/types';
import { FormWrapper } from './FormWrapper';

const formSchema = z.object({
	chunkSize: z.coerce.number(),
	maxSize: z.coerce.number(),
	generateOriginalFileNameWithIdentifier: z.boolean().optional(),
	enableMixedCaseFilenames: z.boolean().optional(),
	generatedFilenameLength: z.coerce.number(),
	blockedExtensions: z.string().optional(),
	blockNoExtension: z.boolean().optional(),
	useNetworkStorage: z.boolean().optional(),
	S3Region: z.string().optional(),
	S3Bucket: z.string().optional(),
	S3AccessKey: z.string().optional(),
	S3SecretKey: z.string().optional(),
	S3Endpoint: z.string().optional(),
	S3PublicUrl: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export function UploadsForm({
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

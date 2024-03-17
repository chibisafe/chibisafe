'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormWrapper } from './FormWrapper';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
	// Users
	publicMode: z.boolean().optional(),
	userAccounts: z.boolean().optional(),
	usersStorageQuota: z.coerce.number(),
	// Customization
	serviceName: z.string(),
	backgroundImageURL: z.string().optional(),
	logoURL: z.string().optional(),
	metaDescription: z.string().optional(),
	metaKeywords: z.string().optional(),
	metaTwitterHandle: z.string().optional(),
	metaDomain: z.string().optional(),
	// Service
	serveUploadsFrom: z.string().optional(),
	rateLimitWindow: z.coerce.number(),
	rateLimitMax: z.coerce.number(),
	secret: z.string(),
	disableUpdateCheck: z.boolean().optional(),
	// Uploads
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
	S3PublicUrl: z.string().optional(),
	// Other
	generateZips: z.boolean().optional(),
	generatedAlbumLength: z.coerce.number()
});

type FormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({
	defaultValues,
	categorizedSettings
}: {
	readonly categorizedSettings: any;
	readonly defaultValues: any;
}) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onChange'
	});

	// TODO: find a way to grab error data instead of just showing them
	// on the form itself, since we are using tabs its difficult to show
	// where the error is coming from
	const onSubmit = (data: FormValues) => {
		toast.success(
			<>
				<pre>
					<code>{JSON.stringify(data, null, 2)}</code>
				</pre>
			</>
		);
	};

	return (
		<>
			<Tabs defaultValue="service">
				<TabsList className="mb-4 gap-2">
					<TabsTrigger value="service">Service</TabsTrigger>
					<TabsTrigger value="uploads">Uploads</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="other">Other</TabsTrigger>
					<TabsTrigger value="customization">Customization</TabsTrigger>
				</TabsList>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<TabsContent value="service">
							<FormWrapper form={form} meta={categorizedSettings.service} />
						</TabsContent>
						<TabsContent value="uploads">
							<FormWrapper form={form} meta={categorizedSettings.uploads} />
						</TabsContent>
						<TabsContent value="users">
							<FormWrapper form={form} meta={categorizedSettings.users} />
						</TabsContent>
						<TabsContent value="other">
							<FormWrapper form={form} meta={categorizedSettings.other} />
						</TabsContent>
						<TabsContent value="customization">
							<FormWrapper form={form} meta={categorizedSettings.customization} />
						</TabsContent>
						<Button type="submit" className="mt-4">
							Save settings
						</Button>
					</form>
				</Form>
			</Tabs>
		</>
	);
};

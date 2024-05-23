'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormWrapper } from './FormWrapper';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import request from '@/lib/request';
import { useQueryClient } from '@tanstack/react-query';
import { saveSettings } from '@/actions/SaveSettingsAction';
import { useLocalStorage } from 'usehooks-ts';

const formSchema = z.object({
	// Users
	publicMode: z.boolean().optional(),
	userAccounts: z.boolean().optional(),
	usersStorageQuota: z.coerce.number(),
	// Customization
	serviceName: z.string().trim().min(1, { message: 'Required' }),
	backgroundImageURL: z.string().optional(),
	logoURL: z.string().optional(),
	metaDescription: z.string().optional(),
	metaKeywords: z.string().optional(),
	metaTwitterHandle: z.string().optional(),
	metaDomain: z.string().optional(),
	useMinimalHomepage: z.boolean().optional(),
	// Service
	serveUploadsFrom: z.string().refine(
		value => {
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: 'Please enter a valid URL'
		}
	),
	rateLimitWindow: z.coerce.number().min(1, { message: 'Required' }),
	rateLimitMax: z.coerce.number().min(1, { message: 'Required' }),
	secret: z.string().trim().min(1, { message: 'Required' }),
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
	generateThumbnails: z.boolean().optional(),
	S3Region: z.string().optional(),
	S3Bucket: z.string().optional(),
	S3AccessKey: z.string().optional(),
	S3SecretKey: z.string().optional(),
	S3Endpoint: z.string().optional(),
	S3PublicUrl: z.string().optional(),
	// Other
	generateZips: z.boolean().optional(),
	generatedAlbumLength: z.coerce.number(),
	generatedLinksLength: z.coerce.number(),
	useUrlShortener: z.boolean().optional(),
	// Legal
	privacyPolicyPageContent: z.string().optional(),
	termsOfServicePageContent: z.string().optional(),
	rulesPageContent: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export const SettingsForm = ({
	defaultValues,
	categorizedSettings
}: {
	readonly categorizedSettings: any;
	readonly defaultValues: any;
}) => {
	const queryClient = useQueryClient();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onChange'
	});

	const [lastValue, setLastValue] = useLocalStorage('last-settings-tab', 'service');

	const onSubmit = async (data: FormValues) => {
		// Each setting is a key-value pair, so we need to convert it to an array of objects
		const settings = Object.entries(data).map(([key, value]) => {
			const type = typeof value;
			return {
				key,
				value,
				type: type === 'number' ? 'number' : type === 'boolean' ? 'boolean' : 'string'
			};
		});

		const { error } = await request.post({
			url: 'admin/service/settings',
			body: {
				settings
			}
		});

		if (error) {
			toast.error(error);
			return;
		}

		toast.success('Settings saved. Please note that some settings may require a server restart to take effect');
		saveSettings();
		void queryClient.invalidateQueries({ queryKey: ['settings'] });
	};

	return (
		<>
			<Tabs defaultValue={lastValue} onValueChange={setLastValue}>
				<TabsList className="mb-4 gap-2">
					<TabsTrigger value="service">Service</TabsTrigger>
					<TabsTrigger value="uploads">Uploads</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
					<TabsTrigger value="other">Other</TabsTrigger>
					<TabsTrigger value="customization">Customization</TabsTrigger>
					<TabsTrigger value="legal">Legal</TabsTrigger>
				</TabsList>

				{form.formState.errors ? (
					<div className="p-2 mb-4">
						<ul className="list-disc px-6 bg-red-900 rounded-sm">
							{Object.keys(form.formState.errors)
								.map(key => {
									// @ts-expect-error types
									return form.formState.errors[key].message ? (
										<li key={key} className="">
											Error in the field{' '}
											<span className="underline underline-offset-2">{key}</span>:{' '}
											{
												// @ts-expect-error types
												form.formState.errors[key].message
											}
										</li>
									) : null;
								})
								.filter(item => item !== null)}
						</ul>
					</div>
				) : null}

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
						<TabsContent value="legal">
							<FormWrapper form={form} meta={categorizedSettings.legal} />
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

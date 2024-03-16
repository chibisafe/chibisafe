'use client';

import type { Setting } from '@/types';
import type { PropsWithChildren } from 'react';
import { FormFieldNumber } from '../FormFieldNumber';
import { FormFieldBoolean } from '../FormFieldBoolean';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormFieldString } from '../FormFieldString';

export const FormWrapper = ({
	form,
	onSubmit,
	meta
}: PropsWithChildren<{ readonly form: any; readonly meta: Setting[]; readonly onSubmit: any }>) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{meta.map(setting => {
					switch (setting.type) {
						case 'string':
							return <FormFieldString form={form} data={setting} key={setting.key} />;
						case 'number':
							return <FormFieldNumber form={form} data={setting} key={setting.key} />;
						case 'boolean':
							return <FormFieldBoolean form={form} data={setting} key={setting.key} />;
						default:
							return <div key={setting.key}>No component found for type: {setting.type}</div>;
					}
				})}
				<Button type="submit">Save settings</Button>
			</form>
		</Form>
	);
};

'use client';

import type { Setting } from '@/types';
import type { PropsWithChildren } from 'react';
import { FormFieldNumber } from './fields/FormFieldNumber';
import { FormFieldBoolean } from './fields/FormFieldBoolean';
import { FormFieldString } from './fields/FormFieldString';
import { FormFieldText } from './fields/FormFieldText';

export const FormWrapper = ({ form, meta }: PropsWithChildren<{ readonly form: any; readonly meta: Setting[] }>) => {
	return (
		<div className="space-y-8">
			{meta.map(setting => {
				switch (setting.type) {
					case 'string':
						return <FormFieldString form={form} data={setting} key={setting.key} />;
					case 'number':
						return <FormFieldNumber form={form} data={setting} key={setting.key} />;
					case 'boolean':
						return <FormFieldBoolean form={form} data={setting} key={setting.key} />;
					case 'text':
						return <FormFieldText form={form} data={setting} key={setting.key} />;
					default:
						return <div key={setting.key}>No component found for type: {setting.type}</div>;
				}
			})}
		</div>
	);
};

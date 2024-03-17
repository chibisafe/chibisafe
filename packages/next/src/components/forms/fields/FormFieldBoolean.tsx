import type { Setting } from '@/types';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '../../ui/form';
import { Switch } from '../../ui/switch';

export const FormFieldBoolean = ({ form, data }: { readonly data: Setting; readonly form: any }) => {
	return (
		<FormField
			control={form.control}
			name={data.key}
			render={({ field }) => (
				<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
					<div className="space-y-0.5">
						<FormLabel className="text-base">{data.name}</FormLabel>
						<FormDescription>{data.description}</FormDescription>
					</div>
					<FormControl>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
				</FormItem>
			)}
		/>
	);
};

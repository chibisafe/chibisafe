import type { Setting } from '@/types';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

export const FormFieldNumber = ({ form, data }: { readonly data: Setting; readonly form: any }) => {
	return (
		<FormField
			control={form.control}
			name={data.key}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{data.name}</FormLabel>
					<FormControl>
						<Input placeholder={data.example} {...field} type="number" />
					</FormControl>
					<FormDescription>{data.description}</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

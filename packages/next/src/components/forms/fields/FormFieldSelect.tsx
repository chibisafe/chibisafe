import type { Setting } from '@/types';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

export const FormFieldSelect = ({ form, data }: { readonly data: Setting; readonly form: any }) => {
	return (
		<FormField
			control={form.control}
			name={data.key}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{data.name}</FormLabel>
					<Select onValueChange={field.onChange} value={field.value}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{data.options?.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormDescription>{data.description}</FormDescription>
					{data.notice ? (
						<FormDescription className="border-l-2 px-2 border-yellow-500 text-yellow-500">
							{data.notice}
						</FormDescription>
					) : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

import { cn } from '@/lib/utils';
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	Select as SelectRoot,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

export interface Item {
	label: number | string;
	value: number | string;
}

export function Select({
	placeholder,
	items,
	onChange,
	value,
	className = ''
}: {
	readonly className?: string;
	readonly items: Item[];
	onChange(value: string): void;
	readonly placeholder?: string;
	readonly value?: string;
}) {
	return (
		<SelectRoot value={value ?? ''} onValueChange={onChange}>
			<SelectTrigger className={cn('', className)}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{items.map((item, idx) => (
						<SelectItem key={idx} value={String(item.value)}>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</SelectRoot>
	);
}

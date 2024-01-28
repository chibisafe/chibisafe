import * as React from 'react';

import { cn } from '@/lib/utils';
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	// SelectLabel,
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
	className
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

				{/* TODO: Support groups from props
				<SelectGroup>
					<SelectLabel>Europe & Africa</SelectLabel>
					<SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
					<SelectItem value="cet">Central European Time (CET)</SelectItem>
					<SelectItem value="eet">Eastern European Time (EET)</SelectItem>
					<SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
					<SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
					<SelectItem value="eat">East Africa Time (EAT)</SelectItem>
				</SelectGroup> */}
			</SelectContent>
		</SelectRoot>
	);
}

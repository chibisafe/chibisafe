'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

export function Combobox({
	data,
	onSelected,
	placeholder = 'Select...'
}: PropsWithChildren<{
	readonly data: { label: string; value: string }[];
	onSelected?(selected: string): void;
	readonly placeholder?: string | undefined;
}>) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between flex"
				>
					{value ? data.find(item => item.value === value)?.label : placeholder}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<input type="hidden" name="language" value={value} />
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search..." className="h-9" />
					<CommandList>
						<CommandEmpty>No result found.</CommandEmpty>
						<CommandGroup>
							{data.map(item => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={currentValue => {
										setValue(currentValue === value ? '' : currentValue);
										onSelected?.(currentValue);
										setOpen(false);
									}}
								>
									{item.label}
									<CheckIcon
										className={cn(
											'ml-auto h-4 w-4',
											value === item.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

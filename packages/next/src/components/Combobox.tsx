'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';

export function Combobox({
	data,
	onSelected,
	placeholder = 'Select...',
	createNewLabel,
	onCreateNew,
	selectedValue
}: PropsWithChildren<{
	readonly data: { label: string; value: string }[];
	onSelected?(selected: string): void;
	readonly placeholder?: string | undefined;
	readonly createNewLabel?: string | undefined;
	onCreateNew?(): void;
	readonly selectedValue?: string | undefined;
}>) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(selectedValue ?? '');

	useEffect(() => {
		if (selectedValue !== undefined) {
			setValue(selectedValue);
		}
	}, [selectedValue]);

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
									keywords={[item.label]}
									onSelect={currentValue => {
										setValue(currentValue === value ? '' : currentValue);
										onSelected?.(currentValue === value ? '' : currentValue);
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
					{createNewLabel && onCreateNew && (
						<>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setOpen(false);
										onCreateNew();
									}}
								>
									<PlusIcon className="mr-2 h-4 w-4" />
									{createNewLabel}
								</CommandItem>
							</CommandGroup>
						</>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
}

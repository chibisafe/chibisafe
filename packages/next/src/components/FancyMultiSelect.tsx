import { useCallback, useRef, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';

// https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx
type Option = Record<'label' | 'value', string>;

export function FancyMultiSelect({
	options = [],
	placeholder = 'Select option...',
	name = 'fancy-multi-select',
	initialSelected = []
}: {
	readonly initialSelected?: string[];
	readonly name?: string;
	readonly options: Option[];
	readonly placeholder?: string;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<Option[]>(
		options.filter(option => initialSelected.includes(option.value))
	);
	const [inputValue, setInputValue] = useState('');

	const handleUnselect = useCallback((option: Option) => {
		setSelected(prev => prev.filter(s => s.value !== option.value));
	}, []);

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;
		if (input) {
			if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '') {
				setSelected(prev => {
					const newSelected = [...prev];
					newSelected.pop();
					return newSelected;
				});
			}

			// This is not a default behaviour of the <input /> field
			if (e.key === 'Escape') {
				input.blur();
			}
		}
	}, []);

	const selectables = options.filter(option => !selected.includes(option));

	return (
		<Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
			<div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex gap-1 flex-wrap">
					{selected.map(option => {
						return (
							<Badge key={option.value} variant="secondary">
								{option.label}
								<button
									type="button"
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={e => {
										if (e.key === 'Enter') {
											handleUnselect(option);
										}
									}}
									onMouseDown={e => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(option)}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && selectables.length > 0 ? (
					<div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
						<CommandGroup className="h-full overflow-auto">
							{selectables.map(option => {
								return (
									<CommandItem
										key={option.value}
										onMouseDown={e => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onSelect={value => {
											setInputValue('');
											setSelected(prev => [...prev, option]);
										}}
										className={'cursor-pointer'}
									>
										{option.label}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</div>
				) : null}
			</div>
		</Command>
	);
}

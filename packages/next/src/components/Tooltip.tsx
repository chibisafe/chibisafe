import { Tooltip as TooltipWrapper, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PropsWithChildren } from 'react';

export function Tooltip({ children, content }: PropsWithChildren<{ readonly content: string }>) {
	return (
		<TooltipProvider delayDuration={100}>
			<TooltipWrapper>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className="bg-primary text-primary-foreground">
					<p>{content}</p>
				</TooltipContent>
			</TooltipWrapper>
		</TooltipProvider>
	);
}

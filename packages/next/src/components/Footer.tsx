import * as React from 'react';

import { cn } from '@/lib/utils';
import { ChibisafeLogo } from '@/components/svg/ChibisafeLogo';

export function SiteFooter({ className }: { readonly className?: React.HTMLAttributes<HTMLElement> }) {
	return (
		<footer className={cn(className)}>
			<div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<ChibisafeLogo className="w-6 h-6" />
					<p className="text-center text-sm leading-loose md:text-left">
						Built by{' '}
						<a
							href="https://kana.dev"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							Pitu
						</a>
						. The source code is available on{' '}
						<a
							href="https://github.com/chibisafe/chibisafe"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							GitHub
						</a>
						.
					</p>
				</div>
			</div>
		</footer>
	);
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/unbound-method
const canUseDOM = Boolean(typeof window !== 'undefined' && window?.document?.createElement);

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const debug =
	process.env.NODE_ENV === 'production'
		? () => {}
		: canUseDOM
		? console.log.bind(
				window.console,
				'%c DEBUG ',
				'background:#35495e; padding: 2px; border-radius: 2px; color: #fff'
		  )
		: () => {};

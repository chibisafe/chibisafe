'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { cn, debug } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/styles/button';

export const RegisterForm = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsLoading(true);
		// TODO: Actually receive data as it's not working rn
		debug(data);
	}

	return (
		<div className={cn('grid gap-6')}>
			<form action={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="username">
							Username
						</Label>
						<Input
							id="username"
							placeholder="Username"
							type="text"
							autoCapitalize="none"
							autoComplete="username"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							placeholder="Password"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="repassword">
							Repeat password
						</Label>
						<Input
							id="repassword"
							placeholder="Repeat password"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Register
					</button>
				</div>
			</form>
		</div>
	);
};

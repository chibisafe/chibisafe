'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';

import { cn, debug } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons';

export const LoginForm = () => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		const doSignIn = await signIn('credentials', {
			redirect: false,
			username: data.get('username'),
			password: data.get('password')
		});

		debug(doSignIn);
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
							name="username"
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
							name="password"
							placeholder="Password"
							type="password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							disabled={isLoading}
						/>
					</div>
					<button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
						{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
						Sign In
					</button>
				</div>
			</form>
		</div>
	);
};

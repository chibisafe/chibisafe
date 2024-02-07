'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';

// import { login } from '@/lib/useAuth';
import { login } from '@/lib/api';
import { currentUserAtom } from '@/lib/useCurrentUser';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';

export const LoginForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const setCurrentUser = useSetAtom(currentUserAtom);

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		try {
			const response = await login({
				username: String(data.get('username')),
				password: String(data.get('password'))
			});

			setCurrentUser(response.user);

			router.push('/dashboard');
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
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

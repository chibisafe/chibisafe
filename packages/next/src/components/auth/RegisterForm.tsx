'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/styles/button';
import { useRouter } from 'next/navigation';
import request from '@/lib/request';
import { toast } from 'sonner';

export const RegisterForm = ({ code }: { readonly code?: string }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		const username = String(data.get('username'));
		const password = String(data.get('password'));
		const repassword = String(data.get('repassword'));

		if (password !== repassword) {
			toast.error('Passwords do not match');
			setIsLoading(false);
			return;
		}

		try {
			await request.post(
				'auth/register',
				{
					username,
					password
				},
				code
					? {
							invite: code
						}
					: undefined
			);

			router.push('/login');
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={cn('grid gap-6')}>
			<form action={onSubmit}>
				{code ? <input type="hidden" name="code" value={code} /> : null}
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
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="repassword">
							Repeat password
						</Label>
						<Input
							id="repassword"
							name="repassword"
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

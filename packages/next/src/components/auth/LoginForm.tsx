'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { Loader2 } from 'lucide-react';
import { currentUserAtom } from '@/lib/atoms/currentUser';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buttonVariants } from '@/styles/button';
import request from '@/lib/request';
import { toast } from 'sonner';

export const LoginForm = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const setCurrentUser = useSetAtom(currentUserAtom);

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		try {
			const {
				data: response,
				error,
				status
			} = await request.post({
				url: 'auth/login',
				body: {
					username: data.get('username') as string,
					password: data.get('password') as string
				}
			});

			if (error && status === 401) {
				toast.error(error);
				return;
			}

			setCurrentUser(response.user);

			router.push('/dashboard');
		} catch (error: any) {
			toast.error(error);
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
							readOnly={isLoading}
							required
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
							readOnly={isLoading}
							required
						/>
					</div>
					<button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Sign In
					</button>
				</div>
			</form>
		</div>
	);
};

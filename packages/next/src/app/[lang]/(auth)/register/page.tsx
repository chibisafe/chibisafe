import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ChibisafeLogo } from '@/components/svg/ChibisafeLogo';
import { buttonVariants } from '@/styles/button';
import request from '@/lib/request';

export const metadata: Metadata = {
	title: 'Create an account',
	description: 'Create an account to get started.'
};

export default async function LoginPage() {
	const { data: settings, error } = await request.get({
		url: 'settings',
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (error || !settings) {
		console.log(error);
	}

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Link
				href="/"
				className={cn(buttonVariants({ variant: 'ghost' }), 'absolute left-4 top-4 md:left-8 md:top-8')}
			>
				<span className="flex items-center flex-row">
					<ChevronLeft className="mr-2 h-4 w-4" /> Back
				</span>
			</Link>
			<Link
				href="/login"
				className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
			>
				Login
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<ChibisafeLogo className="mx-auto mb-4 h-64 w-64" />
					<h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
					{settings?.userAccounts ? (
						<p className="text-sm text-muted-foreground">Enter your email below to create an account</p>
					) : null}
				</div>

				{settings?.userAccounts ? (
					<RegisterForm />
				) : (
					<div className="flex flex-col gap-2 text-center">
						<p className="text-sm text-muted-foreground">
							User registration for this instance is currently disabled
						</p>
					</div>
				)}

				{/* <p className="px-8 text-center text-sm text-muted-foreground">
					By clicking continue, you agree to our{' '}
					<Link href="/terms" className="hover:text-brand underline underline-offset-4">
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href="/privacy" className="hover:text-brand underline underline-offset-4">
						Privacy Policy
					</Link>
					.
				</p> */}
			</div>
		</div>
	);
}

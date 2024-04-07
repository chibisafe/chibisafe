import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ChibisafeLogo } from '@/components/svg/ChibisafeLogo';

export const metadata: Metadata = {
	title: 'You got an invite',
	description: 'Create an account to get started.'
};

export default function InvitePage({ params }: { readonly params: { code: string } }) {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<ChibisafeLogo className="mx-auto mb-4 h-64 w-64" />
					<h1 className="text-2xl font-semibold tracking-tight">You got an invite</h1>
					<p className="text-sm text-muted-foreground">
						You got an invite to create an account on this chibisafe instance. In order to continue please
						create a username and password below.
					</p>
				</div>

				<RegisterForm code={params.code} />

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

import { redirect } from 'next/navigation';

export async function GET(_: Request, { params }: { params: { identifier: string } }) {
	const identifier = params.identifier;
	if (!identifier) {
		return redirect('/404');
	}

	redirect(`/api/link/${identifier}`);
}

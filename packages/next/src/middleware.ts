import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('user')?.value;

	if (
		request.nextUrl.pathname.startsWith('/dashboard') &&
		(!currentUser || Date.now() > JSON.parse(currentUser).expiresAt)
	) {
		request.cookies.delete('user');
		const response = NextResponse.redirect(new URL('/login', request.url));
		response.cookies.delete('user');

		return response;
	}

	if (request.nextUrl.pathname.startsWith('/login') && currentUser) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

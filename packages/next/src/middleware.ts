import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('token')?.value;

	if (
		request.nextUrl.pathname.startsWith('/dashboard') &&
		!currentUser
	) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (request.nextUrl.pathname.startsWith('/login') && currentUser) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	return NextResponse.next();
}

var asd: number = 'asd';

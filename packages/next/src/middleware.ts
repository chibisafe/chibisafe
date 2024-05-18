import { NextResponse, type NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales } from './app/[lang]/dictionaries';

const getLocale = (request: NextRequest) => {
	const acceptedLanguage = request.headers.get('accept-language') ?? undefined;
	const headers = { 'accept-language': acceptedLanguage };
	const languages = new Negotiator({ headers }).languages();
	const defaultLocale = 'en';

	return match(languages, locales, defaultLocale); // -> 'en-US'
};

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('token')?.value;

	if (request.nextUrl.pathname.startsWith('/dashboard') && !currentUser) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (request.nextUrl.pathname.startsWith('/login') && currentUser) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

	if (pathnameHasLocale) return NextResponse.next();

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /products
	// The new URL is now /en-US/products
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, assets, api)
		'/((?!api|assets|.*\\..*|_next).*)'
	]
};

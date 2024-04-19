import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { Callout } from '@/components/mdx/Callout';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

function Table({ data }: { readonly data: any }) {
	const headers = data.headers.map((header: any, index: number) => <th key={index}>{header}</th>);
	const rows = data.rows.map((row: any, index: number) => (
		<tr key={index}>
			{row.map((cell: any, cellIndex: number) => (
				<td key={cellIndex}>{cell}</td>
			))}
		</tr>
	));

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function RoundedImage(props: any) {
	return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function slugify(str: any) {
	return (
		str
			.toString()
			.toLowerCase()
			.trim() // Remove whitespace from both ends of a string
			.replaceAll(/\s+/g, '-') // Replace spaces with -
			.replaceAll('&', '-and-') // Replace & with 'and'
			// eslint-disable-next-line no-useless-escape
			.replaceAll(/[^\w\-]+/g, '') // Remove all non-word characters except for -
			.replaceAll(/--+/g, '-')
	); // Replace multiple - with single -
}

function createHeading(level: number) {
	const Heading = ({ children }: { readonly children: any }) => {
		const slug = slugify(children);
		return React.createElement(
			`h${level}`,
			{
				id: slug,
				className: cn(
					level === 1
						? 'mt-2 scroll-m-20 text-4xl font-bold tracking-tight before:!-left-8'
						: level === 2
							? 'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0'
							: level === 3
								? 'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight'
								: level === 4
									? 'mt-8 scroll-m-20 text-xl font-semibold tracking-tight'
									: level === 5
										? 'mt-8 scroll-m-20 text-lg font-semibold tracking-tight'
										: 'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
					"relative before:content-['#'] before:absolute before:-left-6 before:opacity-0 hover:before:opacity-100"
				)
			},
			[
				React.createElement(
					'a',
					{
						href: `#${slug}`,
						key: `link-${slug}`,
						className: 'anchor'
					},
					children
				)
			]
		);
	};

	Heading.displayName = `Heading${level}`;

	return Heading;
}

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	wrapper: ({ children }: PropsWithChildren) => <div className="container max-w-3xl py-6 lg:py-12">{children}</div>,
	a: ({ className, ...props }: PropsWithChildren<any>) => (
		<a
			className={cn('font-medium underline underline-offset-4 link', className)}
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		/>
	),
	p: ({ className, ...props }: PropsWithChildren<any>) => (
		<p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props} />
	),
	ul: ({ className, ...props }: PropsWithChildren<any>) => (
		<ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
	),
	ol: ({ className, ...props }: PropsWithChildren<any>) => (
		<ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
	),
	li: ({ className, ...props }: PropsWithChildren<any>) => <li className={cn('mt-2', className)} {...props} />,
	blockquote: ({ className, ...props }: PropsWithChildren<any>) => (
		<blockquote className={cn('mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground', className)} {...props} />
	),
	img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img className={cn('rounded-md border', className)} alt={alt} {...props} />
	),
	hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
	Image: RoundedImage,
	code: (content: any) => <CodeBlock code={content} />,
	Table,
	Callout
};

export function CustomMDX(props: any) {
	return <MDXRemote {...props} components={{ ...components, ...props.components }} />;
}

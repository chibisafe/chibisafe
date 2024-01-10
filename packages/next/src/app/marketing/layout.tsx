import '@/styles/globals.css';

interface MarketingLayoutProps {
	readonly children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">{children}</main>
		</div>
	);
}

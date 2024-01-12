interface DashboardHeaderProps {
	readonly children?: React.ReactNode;
	readonly subtitle?: string;
	readonly title: string;
}

export function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
	return (
		<div className="flex items-center justify-between px-2">
			<div className="grid gap-1">
				<h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">{title}</h1>
				{subtitle ? <p className="text-lg text-muted-foreground">{subtitle}</p> : null}
			</div>
			{children}
		</div>
	);
}

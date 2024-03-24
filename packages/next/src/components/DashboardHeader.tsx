import type { BreadcrumbPage } from '@/types';
import Breadcrumbs from './Breadcrumbs';

interface DashboardHeaderProps {
	readonly breadcrumbs?: BreadcrumbPage[];
	readonly children?: React.ReactNode;
	readonly subtitle?: string;
	readonly title: string;
}

export function DashboardHeader({ title, subtitle, breadcrumbs, children }: DashboardHeaderProps) {
	return (
		<>
			<Breadcrumbs pages={breadcrumbs} />
			<div className="flex w-fit sm:w-auto sm:items-center sm:justify-between px-2 flex-col sm:flex-row">
				<div className="grid gap-0 sm:gap-1 mb-4 sm:mb-0">
					<h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">{title}</h1>
					{subtitle ? <p className="text-lg text-muted-foreground">{subtitle}</p> : null}
				</div>
				{children}
			</div>
		</>
	);
}

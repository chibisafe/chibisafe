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
		<div className="flex flex-col gap-4 w-full">
			<Breadcrumbs pages={breadcrumbs} />
			<div className="flex px-2 flex-col sm:flex-row sm:place-items-center place-content-between w-full">
				<div className="flex flex-col sm:gap-1 mb-4 sm:mb-0">
					<h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">{title}</h1>
					{subtitle ? <p className="text-lg text-muted-foreground">{subtitle}</p> : null}
				</div>
				{children}
			</div>
		</div>
	);
}

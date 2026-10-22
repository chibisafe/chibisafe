'use client';

import type { PropsWithChildren } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { cn } from '@/lib/utils';

const chartColors = {
	blue: '#3b82f6',
	cyan: '#06b6d4',
	emerald: '#10b981',
	indigo: '#6366f1',
	orange: '#f97316',
	rose: '#f43f5e',
	yellow: '#eab308'
};

type ChartColor = keyof typeof chartColors;

const clampPercentage = (value: number) => (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0);

export function CategoryBar({
	values,
	colors,
	markerValue
}: {
	readonly colors: ChartColor[];
	readonly markerValue: number;
	readonly values: number[];
}) {
	return (
		<div
			role="meter"
			aria-label="Usage"
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={clampPercentage(markerValue)}
			className="relative my-2"
		>
			<div className="flex h-2 overflow-hidden rounded-full">
				{values.map((value, index) => (
					<div key={index} style={{ flex: value, backgroundColor: chartColors[colors[index] ?? 'blue'] }} />
				))}
			</div>
			<div
				className="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-background"
				style={{ left: `${clampPercentage(markerValue)}%` }}
			/>
		</div>
	);
}

export function ProgressCircle({ value, children }: PropsWithChildren<{ readonly value: number }>) {
	return (
		<div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
			<svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64" role="img" aria-label={`${value}% used`}>
				<circle cx="32" cy="32" r="27" fill="none" strokeWidth="6" className="stroke-muted" />
				<circle
					cx="32"
					cy="32"
					r="27"
					fill="none"
					strokeWidth="6"
					stroke={chartColors.blue}
					pathLength="100"
					strokeDasharray={`${clampPercentage(value)} 100`}
				/>
			</svg>
			<span className="tabular-nums">{children}</span>
		</div>
	);
}

export function DonutChart({
	data,
	colors,
	className
}: {
	readonly className?: string;
	readonly colors: ChartColor[];
	readonly data: { name: string; value: number }[];
}) {
	const chartData = data.map((entry, index) => ({
		...entry,
		fill: chartColors[colors[index % colors.length] ?? 'blue']
	}));
	const total = data.reduce((sum, entry) => sum + entry.value, 0);

	return (
		<div
			className={cn('relative h-40', className)}
			role="img"
			aria-label={data.map(entry => `${entry.name}: ${entry.value}`).join(', ')}
		>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={chartData}
						dataKey="value"
						nameKey="name"
						innerRadius="65%"
						outerRadius="95%"
						stroke="none"
						isAnimationActive={false}
					/>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
			<span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">
				{total.toLocaleString()}
			</span>
		</div>
	);
}

export function Legend({
	categories,
	colors,
	className
}: {
	readonly categories: string[];
	readonly className?: string;
	readonly colors: ChartColor[];
}) {
	return (
		<ul className={cn('flex flex-wrap gap-3 text-sm', className)}>
			{categories.map((category, index) => (
				<li key={category} className="flex items-center gap-2">
					<span
						className="h-2 w-2 rounded-full"
						style={{ backgroundColor: chartColors[colors[index] ?? 'blue'] }}
					/>
					{category}
				</li>
			))}
		</ul>
	);
}

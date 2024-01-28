// Copied from https://github.com/askides/react-plock
// since it needs patching for SSR so we do it locally

import * as React from 'react';

export function useMediaValues(medias: number[] | undefined, columns: number[], gap: number[]) {
	const [values, setValues] = React.useState({ columns: 0, gap: 0 });

	React.useEffect(() => {
		if (!medias) {
			// @ts-expect-error fix later
			setValues({ columns: columns[0], gap: gap[0] });
			return;
		}

		const mediaQueries = medias.map(media => window.matchMedia(`(min-width: ${media}px)`));

		const onSizeChange = () => {
			let matches = 0;

			for (const mediaQuery of mediaQueries) {
				if (mediaQuery.matches) {
					matches++;
				}
			}

			// Update Values
			const idx = Math.min(mediaQueries.length - 1, Math.max(0, matches));
			// @ts-expect-error fix later
			setValues({ columns: columns[idx], gap: gap[idx] });
		};

		// Initial Call
		onSizeChange();

		// Apply Listeners
		for (const mediaQuery of mediaQueries) {
			mediaQuery.addEventListener('change', onSizeChange);
		}

		return () => {
			for (const mediaQuery of mediaQueries) {
				mediaQuery.removeEventListener('change', onSizeChange);
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values.columns, values.gap]);

	return values;
}

export type MasonryProps<T> = React.ComponentPropsWithoutRef<'div'> & {
	readonly config: {
		columns: number[] | number;
		gap: number[] | number;
		media?: number[];
	};

	readonly items: T[];
	render(item: T, idx: number): React.ReactNode;
};

export function createSafeArray(data: number[] | number) {
	return Array.isArray(data) ? data : [data];
}

export function Masonry<T>({ items = [], render, config, ...rest }: MasonryProps<T>) {
	const { columns, gap } = useMediaValues(config.media, createSafeArray(config.columns), createSafeArray(config.gap));
	if (!columns) return null;

	const chunks = createChunks<T>(items, columns);
	const dataColumns = createDataColumns<T>(chunks, columns);

	return (
		<div
			{...rest}
			style={{
				display: 'grid',
				alignItems: 'start',
				gridColumnGap: gap,
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
			}}
		>
			{dataColumns.map((column, idx) => (
				<MasonryRow gap={gap} key={idx}>
					{column.map((item, idx) => render(item, idx))}
				</MasonryRow>
			))}
		</div>
	);
}

export function MasonryRow({ children, gap }: { readonly children: React.ReactNode; readonly gap: number }) {
	return (
		<div
			style={{
				display: 'grid',
				rowGap: gap,
				gridTemplateColumns: 'minmax(0, 1fr)'
			}}
		>
			{children}
		</div>
	);
}

export function createChunks<T>(data: T[] = [], columns = 3) {
	const result = [];

	for (let idx = 0; idx < data.length; idx += columns) {
		const slice = data.slice(idx, idx + columns);
		result.push(slice);
	}

	return result;
}

export function createDataColumns<T>(data: T[][] = [], columns = 3) {
	const result = Array.from<T[], T[]>({ length: columns }, () => []);

	for (let idx = 0; idx < columns; idx++) {
		for (const datum of data) {
			if (datum[idx]) {
				// @ts-expect-error fix later
				result[idx].push(datum[idx]);
			}
		}
	}

	return result;
}

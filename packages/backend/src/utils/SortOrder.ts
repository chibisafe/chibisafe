export const VALID_SORT_FIELDS = ['createdAt', 'name', 'id'] as const;
export const VALID_SORT_DIRECTIONS = ['asc', 'desc'] as const;

export const isValidSortOrder = (sortOrder: string | null | undefined): boolean => {
	if (!sortOrder) return true; // null/empty is valid (uses default)

	const [field, direction] = sortOrder.split(':');
	if (!field || !direction) return false;

	return (
		VALID_SORT_FIELDS.includes(field as (typeof VALID_SORT_FIELDS)[number]) &&
		VALID_SORT_DIRECTIONS.includes(direction as (typeof VALID_SORT_DIRECTIONS)[number])
	);
};

export const parseSortOrder = (sortOrder: string | null | undefined): { [key: string]: 'asc' | 'desc' } => {
	const defaultOrder = { id: 'desc' as const };
	if (!sortOrder) return defaultOrder;

	const [field, direction] = sortOrder.split(':');
	if (!field || !direction) return defaultOrder;

	if (
		!VALID_SORT_FIELDS.includes(field as (typeof VALID_SORT_FIELDS)[number]) ||
		!VALID_SORT_DIRECTIONS.includes(direction as (typeof VALID_SORT_DIRECTIONS)[number])
	) {
		return defaultOrder;
	}

	return { [field]: direction as 'asc' | 'desc' };
};

'use client';

import { forwardRef } from 'react';
import type { DropZoneProps } from 'react-aria-components';
import { DropZone as DropZonePrimitive } from 'react-aria-components';

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>((props, ref) => {
	const { ...additionalProps } = props;

	return <DropZonePrimitive {...additionalProps} ref={ref} />;
});

'use client';

import { forwardRef } from 'react';
import type { FileTriggerProps } from 'react-aria-components';
import { FileTrigger as FileTriggerPrimitive } from 'react-aria-components';

export const FileTrigger = forwardRef<HTMLInputElement, FileTriggerProps>((props, ref) => {
	const { ...additionalProps } = props;

	return <FileTriggerPrimitive {...additionalProps} ref={ref} />;
});

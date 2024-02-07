import type { ComponentProps } from 'react';
import Image from 'next/image';

import chibisafeLogo from '../../public/logo.svg';

export const ChibisafeLogo = (props: Omit<ComponentProps<typeof Image>, 'alt' | 'src'>) => {
	return <Image priority src={chibisafeLogo} alt="chibisafe" {...props} />;
};

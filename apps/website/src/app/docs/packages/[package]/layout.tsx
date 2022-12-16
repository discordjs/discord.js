import type { PropsWithChildren } from 'react';
import { PACKAGES } from '~/util/constants';

export async function generateStaticParams() {
	return PACKAGES.map((packageName) => ({ package: packageName }));
}

export default function PackageLayout({ children }: PropsWithChildren) {
	return children;
}

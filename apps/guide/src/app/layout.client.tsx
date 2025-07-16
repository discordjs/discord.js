'use client';

import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

export function Body({ children }: { readonly children: ReactNode }): React.ReactElement {
	const mode = useMode();

	// page highlight color based on path src/styles/base.css
	return <body className={`${mode ? `${mode} ` : ''}overscroll-y-none`}>{children}</body>;
}

export function useMode(): string | undefined {
	const { slug } = useParams();
	return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}

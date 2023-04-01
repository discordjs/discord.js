'use client';

import { useSystemThemeFallback } from '~/hooks/useSystemThemeFallback';

export function SystemThemeFallback() {
	useSystemThemeFallback();

	return null;
}

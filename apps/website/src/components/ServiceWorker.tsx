'use client';

import { useUnregisterServiceWorker } from '~/hooks/useUnregisterServiceWorker';

export function ServiceWorker() {
	useUnregisterServiceWorker();

	return null;
}

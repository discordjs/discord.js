'use client';

import { useEffect } from 'react';

export function useUnregisterServiceWorker() {
	useEffect(() => {
		// eslint-disable-next-line promise/prefer-await-to-then
		void navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) {
				void registration.unregister();
			}
		});
	}, []);
}

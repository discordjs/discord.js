import { createHmac, randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { warning } from '@actions/core';

export type ReleaseEvent = 'completed' | 'failed' | 'planned' | 'started';

export interface NotificationContext {
	branch: string;
	mode: string;
	repository: string;
	requestId: string | null;
	runAttempt: number;
	runId: string;
	runUrl: string;
	workflow: string;
}

export type NotifyRelease<Details extends object> = (event: ReleaseEvent, details?: Details) => Promise<void>;

async function noopNotify() {}

/**
 * Optional signed callbacks shared by release actions. Each caller defines its own detail payload.
 */
export function createReleaseNotifier<Details extends object>(
	context: NotificationContext,
	config: { secret: string; url: string },
): NotifyRelease<Details> {
	if (!config.url && !config.secret) return noopNotify;
	if (!config.url || !config.secret) {
		warning('Release callbacks require both RELEASE_WEBHOOK_URL and RELEASE_WEBHOOK_SECRET; callbacks are disabled.');
		return noopNotify;
	}

	try {
		const url = new URL(config.url);
		if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid callback URL');
	} catch {
		warning('RELEASE_WEBHOOK_URL must be an HTTPS URL without embedded credentials; callbacks are disabled.');
		return noopNotify;
	}

	let sequence = 0;
	return async (event, details) => {
		const id = randomUUID();
		const timestamp = Math.floor(Date.now() / 1_000).toString();
		const body = JSON.stringify({
			...context,
			...details,
			schemaVersion: 1,
			id,
			sequence: ++sequence,
			timestamp,
			event,
		});
		const signature = createHmac('sha256', config.secret).update(`${timestamp}.${body}`).digest('hex');
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				const response = await fetch(config.url, {
					method: 'POST',
					redirect: 'error',
					signal: AbortSignal.timeout(5_000),
					body,
					headers: {
						'Content-Type': 'application/json',
						'X-Release-Delivery': id,
						'X-Release-Timestamp': timestamp,
						'X-Release-Signature-256': `sha256=${signature}`,
					},
				});
				await response.body?.cancel();
				if (response.ok) return;
				if (response.status < 500 && response.status !== 429) break;
			} catch {
				// Neither the callback URL nor network errors are logged; either may contain credentials.
			}

			if (attempt < 2) await setTimeout(500 * 2 ** attempt);
		}

		warning(`Release callback "${event}" could not be delivered. The workflow will continue.`);
	};
}

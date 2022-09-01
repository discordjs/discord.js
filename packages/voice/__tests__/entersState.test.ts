/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import EventEmitter from 'node:events';
import process from 'node:process';
import type { VoiceConnection } from '../src/VoiceConnection';
import { VoiceConnectionStatus } from '../src/VoiceConnection';
import { entersState } from '../src/util/entersState';

function createFakeVoiceConnection(status = VoiceConnectionStatus.Signalling) {
	const vc = new EventEmitter() as any;
	vc.state = { status };
	return vc as VoiceConnection;
}

beforeEach(() => {
	jest.useFakeTimers();
});

describe('entersState', () => {
	test('Returns the target once the state has been entered before timeout', async () => {
		jest.useRealTimers();
		const vc = createFakeVoiceConnection();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		process.nextTick(() => vc.emit(VoiceConnectionStatus.Ready, null as any, null as any));
		const result = await entersState(vc, VoiceConnectionStatus.Ready, 1_000);
		expect(result).toEqual(vc);
	});

	test('Rejects once the timeout is exceeded', async () => {
		const vc = createFakeVoiceConnection();
		const promise = entersState(vc, VoiceConnectionStatus.Ready, 1_000);
		jest.runAllTimers();
		await expect(promise).rejects.toThrowError();
	});

	test('Returns the target once the state has been entered before signal is aborted', async () => {
		jest.useRealTimers();
		const vc = createFakeVoiceConnection();
		const ac = new AbortController();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		process.nextTick(() => vc.emit(VoiceConnectionStatus.Ready, null as any, null as any));
		const result = await entersState(vc, VoiceConnectionStatus.Ready, ac.signal);
		expect(result).toEqual(vc);
	});

	test('Rejects once the signal is aborted', async () => {
		const vc = createFakeVoiceConnection();
		const ac = new AbortController();
		const promise = entersState(vc, VoiceConnectionStatus.Ready, ac.signal);
		ac.abort();
		await expect(promise).rejects.toThrowError();
	});

	test('Resolves immediately when target already in desired state', async () => {
		const vc = createFakeVoiceConnection();
		await expect(entersState(vc, VoiceConnectionStatus.Signalling, 1_000)).resolves.toEqual(vc);
	});
});

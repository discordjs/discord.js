import { Buffer } from 'node:buffer';
import { describe, test, expect, vitest, beforeEach } from 'vitest';
import { DAVESession } from '../src/networking/DAVESession';

vitest.mock('@snazzah/davey', () => ({
	default: {
		DAVE_PROTOCOL_VERSION: 1,
		MediaType: { AUDIO: 0 },
		DAVESession: vitest.fn().mockImplementation(() => ({
			ready: true,
			canPassthrough: vitest.fn().mockReturnValue(true),
			decrypt: vitest.fn().mockImplementation(() => {
				throw new Error('DecryptionFailed');
			}),
			reinit: vitest.fn(),
			reset: vitest.fn(),
			getSerializedKeyPackage: vitest.fn().mockReturnValue(Buffer.alloc(0)),
		})),
	},
}));

describe('DAVESession', () => {
	let session: DAVESession;

	beforeEach(() => {
		session = new DAVESession(1, '12345', '67890', { decryptionFailureTolerance: 2 });
		session.reinit();
	});

	test('recovers from invalid transition when lastTransitionId is 0', () => {
		session.lastTransitionId = 0;
		const recoverSpy = vitest.spyOn(session, 'recoverFromInvalidTransition');

		const dummyPacket = Buffer.from([1, 2, 3, 4]);
		expect(session.decrypt(dummyPacket, 'user-1')).toBeNull();
		expect(session.decrypt(dummyPacket, 'user-1')).toBeNull();
		expect(session.decrypt(dummyPacket, 'user-1')).toBeNull();

		expect(recoverSpy).toHaveBeenCalledWith(0);
	});

	test('throws error when lastTransitionId is undefined after exceeding tolerance', () => {
		session.lastTransitionId = undefined;

		const dummyPacket = Buffer.from([1, 2, 3, 4]);
		expect(session.decrypt(dummyPacket, 'user-1')).toBeNull();
		expect(session.decrypt(dummyPacket, 'user-1')).toBeNull();
		expect(() => session.decrypt(dummyPacket, 'user-1')).toThrow('DecryptionFailed');
	});
});

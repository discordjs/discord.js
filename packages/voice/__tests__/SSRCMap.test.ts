/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type EventEmitter from 'node:events';
import { once } from 'node:events';
import process from 'node:process';
import type { VoiceUserData } from '../src/receive/SSRCMap';
import { SSRCMap } from '../src/receive/SSRCMap';

async function onceOrThrow<T extends EventEmitter>(target: T, event: string, after: number) {
	return new Promise((resolve, reject) => {
		target.on(event, resolve);
		setTimeout(() => reject(new Error('Time up')), after);
	});
}

describe('SSRCMap', () => {
	test('update persists data and emits correctly', async () => {
		const fixture1: VoiceUserData = {
			audioSSRC: 1,
			userId: '123',
		};

		const fixture2: VoiceUserData = {
			...fixture1,
			videoSSRC: 2,
		};

		const map = new SSRCMap();
		process.nextTick(() => map.update(fixture1));
		let [oldData, newData] = await once(map, 'update');
		expect(oldData).toBeUndefined();
		expect(newData).toMatchObject(fixture1);
		expect(map.get(fixture1.audioSSRC)).toMatchObject(fixture1);

		process.nextTick(() => map.update(fixture2));
		[oldData, newData] = await once(map, 'update');
		expect(oldData).toMatchObject(fixture1);
		expect(newData).toMatchObject(fixture2);
		expect(map.get(fixture1.userId)).toMatchObject(fixture2);
	});

	test('delete removes data and emits correctly', async () => {
		const fixture1: VoiceUserData = {
			audioSSRC: 1,
			userId: '123',
		};
		const map = new SSRCMap();

		map.delete(fixture1.audioSSRC);
		await expect(onceOrThrow(map, 'delete', 5)).rejects.toThrow();

		map.update(fixture1);
		process.nextTick(() => map.delete(fixture1.audioSSRC));
		await expect(once(map, 'delete')).resolves.toMatchObject([fixture1]);

		map.delete(fixture1.audioSSRC);
		await expect(onceOrThrow(map, 'delete', 5)).rejects.toThrow();

		map.update(fixture1);
		process.nextTick(() => map.delete(fixture1.userId));
		await expect(once(map, 'delete')).resolves.toMatchObject([fixture1]);
		expect(map.get(fixture1.audioSSRC)).toBeUndefined();
	});
});

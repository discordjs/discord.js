import type { APIVoiceState, APIVoiceRegion } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { VoiceState, VoiceRegion, dateToDiscordISOTimestamp } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const voiceState: APIVoiceState = {
	guild_id: '26346565245',
	channel_id: '467376575647',
	user_id: '3657654746576457',
	session_id: '35676764576457465',
	deaf: false,
	self_deaf: false,
	self_mute: true,
	self_video: true,
	self_stream: false,
	suppress: false,
	request_to_speak_timestamp: '2023-10-10T15:50:17.209000+00:00',
	mute: false,
};

const voiceRegion: APIVoiceRegion = {
	id: 'c-lhr14-9283nc8e',
	name: 'eu-west-2',
	optimal: true,
	deprecated: false,
	custom: false,
};

describe('VoiceState structure', () => {
	const data = voiceState;
	const instance = new VoiceState(data);

	test('correct value for all getters', () => {
		expect(instance.channelId).toBe(data.channel_id);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.sessionId).toBe(data.session_id);
		expect(instance.userId).toBe(data.user_id);

		expect(instance.deaf).toBeFalsy();
		expect(instance.mute).toBeFalsy();
		expect(instance.selfDeaf).toBeFalsy();
		expect(instance.suppress).toBeFalsy();
		expect(instance.selfMute).toBeTruthy();
		expect(instance.selfVideo).toBeTruthy();
		expect(instance.selfStream).toBeFalsy();

		const requestToSpeakTimestamp = Date.parse(data.request_to_speak_timestamp!);
		expect(instance.requestToSpeakTimestamp).toBe(dateToDiscordISOTimestamp(new Date(requestToSpeakTimestamp)));
		expect(instance.requestToSpeakAt!.valueOf()).toBe(requestToSpeakTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const self_video = false;
		const mute = true;

		const patched = instance[kPatch]({
			self_video,
			mute,
		});

		expect(patched.mute).toBeTruthy();
		expect(patched.selfVideo).toBeFalsy();

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});

describe('VoiceRegion structure', () => {
	const data = voiceRegion;
	const instance = new VoiceRegion(data);

	test('correct value for all getters', () => {
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);

		expect(instance.custom).toBeFalsy();
		expect(instance.deprecated).toBeFalsy();
		expect(instance.optimal).toBeTruthy();
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const name = 'a new name';

		const patched = instance[kPatch]({
			deprecated: true,
			name,
		});

		expect(patched.name).toEqual(name);
		expect(patched.deprecated).toBeTruthy();

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});

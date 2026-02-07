import {
	type APIAutoModerationAction,
	type APIAutoModerationActionMetadata,
	type APIAutoModerationRule,
	type APIAutoModerationRuleTriggerMetadata,
	AutoModerationActionType,
	AutoModerationRuleEventType,
	AutoModerationRuleTriggerType,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import {
	AutoModerationAction,
	AutoModerationActionMetadata,
	AutoModerationRule,
	AutoModerationRuleTriggerMetadata,
} from '../src/automoderation/index.js';
import { kPatch } from '../src/utils/symbols';

const ruleTriggerMetadataData: APIAutoModerationRuleTriggerMetadata = {
	mention_total_limit: 5,
};

const actionMetadataData: APIAutoModerationActionMetadata = {
	channel_id: '1',
	custom_message: 'go away.',
};

const actions: APIAutoModerationAction[] = [
	{
		type: AutoModerationActionType.BlockMessage,
		metadata: actionMetadataData,
	},
];

const ruleData: APIAutoModerationRule = {
	id: '1',
	guild_id: '2',
	name: 'ruleName',
	creator_id: '1',
	event_type: AutoModerationRuleEventType.MessageSend,
	trigger_metadata: ruleTriggerMetadataData,
	trigger_type: AutoModerationRuleTriggerType.MentionSpam,
	enabled: true,
	actions,
	exempt_channels: ['1'],
	exempt_roles: [],
};

describe('AutoModerationRule structure', () => {
	const instance = new AutoModerationRule(ruleData);
	const data = ruleData;

	test('correct value for all getters', () => {
		expect(instance.id).toBe(data.id);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.name).toBe(data.name);
		expect(instance.creatorId).toBe(data.creator_id);
		expect(instance.eventType).toBe(data.event_type);
		expect(instance.enabled).toBe(data.enabled);
	});

	test('toJSON() correctly mirrors API data', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('Patching the AutoModerationRule works in place', () => {
		const patched = instance[kPatch]({
			exempt_channels: ['2'],
			exempt_roles: ['1', '2', '3'],
		});

		expect(patched.toJSON()).not.toEqual(data);
		expect(instance.toJSON()).toEqual(patched.toJSON());
	});

	describe('AutoModerationRuleTriggerMetadata sub-structure', () => {
		const instance = new AutoModerationRuleTriggerMetadata(ruleTriggerMetadataData);
		const data = ruleTriggerMetadataData;

		test('getters return correct values', () => {
			expect(instance.allowList).toBe(data.allow_list);
			expect(instance.keywordFilter).toBe(data.keyword_filter);
			expect(instance.mentionRaidProtectionEnabled).toBe(data.mention_raid_protection_enabled);
			expect(instance.mentionTotalLimit).toBe(data.mention_total_limit);
			expect(instance.presets).toBe(data.presets);
			expect(instance.regexPatterns).toBe(data.regex_patterns);
		});

		test('toJSON() returns expected API data', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in place', () => {
			const patched = instance[kPatch]({
				mention_total_limit: 10,
			});

			expect(patched.mentionTotalLimit).toBe(patched.mentionTotalLimit);

			expect(patched.toJSON()).toEqual(instance.toJSON());
		});
	});

	describe('AutoModerationAction structure', () => {
		const instance = new AutoModerationAction(actions[0] as APIAutoModerationAction);
		const data = actions[0];

		test('correct value for all getters', () => {
			expect(instance.type).toBe(data!.type);
		});

		test('toJSON() returns expected API data', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in place', () => {
			const patched = instance[kPatch]({
				type: AutoModerationActionType.Timeout,
			});

			expect(instance.type).toBe(patched.type);

			expect(patched.toJSON()).toEqual(instance.toJSON());
		});
	});

	describe('AutoModerationActionMetadata sub-structure', () => {
		const instance = new AutoModerationActionMetadata(actionMetadataData);
		const data = actionMetadataData;

		test('all getters working as expected', () => {
			expect(instance.channelId).toBe(data.channel_id);
			expect(instance.customMessage).toBe(data.custom_message);
			expect(instance.durationSeconds).toBe(data.duration_seconds);
		});

		test('toJSON() returns expected results', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in place', () => {
			const patched = instance[kPatch]({
				custom_message: 'noo come back',
				duration_seconds: 100,
			});

			expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			expect(patched.customMessage).toBe(instance.customMessage);
			expect(patched.durationSeconds).toBe(instance.durationSeconds);
		});
	});
});

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/dot-notation */
import EventEmitter from 'node:events';
import * as _DataStore from '../src/DataStore';
import {
	createVoiceConnection,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
	type VoiceConnectionConnectingState,
	type VoiceConnectionReadyState,
	type VoiceConnectionSignallingState,
} from '../src/VoiceConnection';
import * as _AudioPlayer from '../src/audio/AudioPlayer';
import { PlayerSubscription as _PlayerSubscription } from '../src/audio/PlayerSubscription';
import * as _Networking from '../src/networking/Networking';
import type { DiscordGatewayAdapterLibraryMethods } from '../src/util/adapter';

jest.mock('../src/audio/AudioPlayer');
jest.mock('../src/audio/PlayerSubscription');
jest.mock('../src/DataStore');
jest.mock('../src/networking/Networking');

const DataStore = _DataStore as unknown as jest.Mocked<typeof _DataStore>;
const Networking = _Networking as unknown as jest.Mocked<typeof _Networking>;
const AudioPlayer = _AudioPlayer as unknown as jest.Mocked<typeof _AudioPlayer>;
const PlayerSubscription = _PlayerSubscription as unknown as jest.Mock<_PlayerSubscription>;

Networking.Networking.mockImplementation(function mockedConstructor() {
	this.state = {};
	return this;
});

function createFakeAdapter() {
	const sendPayload = jest.fn();
	sendPayload.mockReturnValue(true);
	const destroy = jest.fn();
	const libMethods: Partial<DiscordGatewayAdapterLibraryMethods> = {};
	return {
		sendPayload,
		destroy,
		libMethods,
		creator: jest.fn((methods) => {
			Object.assign(libMethods, methods);
			return {
				sendPayload,
				destroy,
			};
		}),
	};
}

function createJoinConfig() {
	return {
		channelId: '1',
		guildId: '2',
		selfDeaf: true,
		selfMute: false,
		group: 'default',
	};
}

function createFakeVoiceConnection() {
	const adapter = createFakeAdapter();
	const joinConfig = createJoinConfig();
	const voiceConnection = new VoiceConnection(joinConfig, {
		debug: false,
		adapterCreator: adapter.creator,
	});
	return { adapter, joinConfig, voiceConnection };
}

beforeEach(() => {
	DataStore.createJoinVoiceChannelPayload.mockReset();
	DataStore.getVoiceConnection.mockReset();
	DataStore.trackVoiceConnection.mockReset();
	DataStore.untrackVoiceConnection.mockReset();
});

describe('createVoiceConnection', () => {
	test('New voice connection', () => {
		const mockPayload = Symbol('mock') as any;
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => mockPayload);
		const adapter = createFakeAdapter();
		const joinConfig = createJoinConfig();
		const voiceConnection = createVoiceConnection(joinConfig, {
			debug: false,
			adapterCreator: adapter.creator,
		});
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
		expect(DataStore.getVoiceConnection).toHaveBeenCalledTimes(1);
		expect(DataStore.trackVoiceConnection).toHaveBeenCalledWith(voiceConnection);
		expect(DataStore.untrackVoiceConnection).not.toHaveBeenCalled();
		expect(adapter.sendPayload).toHaveBeenCalledWith(mockPayload);
	});

	test('New voice connection with adapter failure', () => {
		const mockPayload = Symbol('mock') as any;
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => mockPayload);
		const adapter = createFakeAdapter();
		adapter.sendPayload.mockReturnValue(false);
		const joinConfig = createJoinConfig();
		const voiceConnection = createVoiceConnection(joinConfig, {
			debug: false,
			adapterCreator: adapter.creator,
		});
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Disconnected);
		expect(DataStore.getVoiceConnection).toHaveBeenCalledTimes(1);
		expect(DataStore.trackVoiceConnection).toHaveBeenCalledWith(voiceConnection);
		expect(DataStore.untrackVoiceConnection).not.toHaveBeenCalled();
		expect(adapter.sendPayload).toHaveBeenCalledWith(mockPayload);
	});

	test('Reconfiguring existing connection', () => {
		const mockPayload = Symbol('mock') as any;

		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => mockPayload);

		const existingAdapter = createFakeAdapter();
		const existingJoinConfig = createJoinConfig();
		const existingVoiceConnection = new VoiceConnection(existingJoinConfig, {
			debug: false,
			adapterCreator: existingAdapter.creator,
		});

		const stateSetter = jest.spyOn(existingVoiceConnection, 'state', 'set');

		// @ts-expect-error: We're testing
		DataStore.getVoiceConnection.mockImplementation((guildId, group = 'default') =>
			guildId === existingJoinConfig.guildId && group === existingJoinConfig.group ? existingVoiceConnection : null,
		);

		const newAdapter = createFakeAdapter();
		const newJoinConfig = createJoinConfig();
		const newVoiceConnection = createVoiceConnection(newJoinConfig, {
			debug: false,
			adapterCreator: newAdapter.creator,
		});
		expect(DataStore.getVoiceConnection).toHaveBeenCalledWith(newJoinConfig.guildId, newJoinConfig.group);
		expect(DataStore.trackVoiceConnection).not.toHaveBeenCalled();
		expect(DataStore.untrackVoiceConnection).not.toHaveBeenCalled();
		expect(newAdapter.creator).not.toHaveBeenCalled();
		expect(existingAdapter.sendPayload).toHaveBeenCalledWith(mockPayload);
		expect(newVoiceConnection).toEqual(existingVoiceConnection);
		expect(stateSetter).not.toHaveBeenCalled();
	});

	test('Calls rejoin() on existing disconnected connection', () => {
		const mockPayload = Symbol('mock') as any;

		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => mockPayload);

		const existingAdapter = createFakeAdapter();
		const existingJoinConfig = createJoinConfig();
		const existingVoiceConnection = new VoiceConnection(existingJoinConfig, {
			debug: false,
			adapterCreator: existingAdapter.creator,
		});
		existingVoiceConnection.state = {
			status: VoiceConnectionStatus.Disconnected,
			adapter: existingAdapter,
			reason: VoiceConnectionDisconnectReason.EndpointRemoved,
		};

		const rejoinSpy = jest.spyOn(existingVoiceConnection, 'rejoin');

		// @ts-expect-error: We're testing
		DataStore.getVoiceConnection.mockImplementation((guildId, group = 'default') =>
			guildId === existingJoinConfig.guildId && group === existingJoinConfig.group ? existingVoiceConnection : null,
		);

		const newAdapter = createFakeAdapter();
		const newJoinConfig = createJoinConfig();
		const { guildId, group, ...rejoinConfig } = newJoinConfig;
		const newVoiceConnection = createVoiceConnection(newJoinConfig, {
			debug: false,
			adapterCreator: newAdapter.creator,
		});
		expect(DataStore.getVoiceConnection).toHaveBeenCalledWith(newJoinConfig.guildId, newJoinConfig.group);
		expect(DataStore.trackVoiceConnection).not.toHaveBeenCalled();
		expect(DataStore.untrackVoiceConnection).not.toHaveBeenCalled();
		expect(newAdapter.creator).not.toHaveBeenCalled();
		expect(rejoinSpy).toHaveBeenCalledWith(rejoinConfig);
		expect(newVoiceConnection).toEqual(existingVoiceConnection);
	});

	test('Reconfiguring existing connection with adapter failure', () => {
		const mockPayload = Symbol('mock') as any;

		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => mockPayload);

		const existingAdapter = createFakeAdapter();
		const existingJoinConfig = createJoinConfig();
		const existingVoiceConnection = new VoiceConnection(existingJoinConfig, {
			debug: false,
			adapterCreator: existingAdapter.creator,
		});

		// @ts-expect-error: We're testing
		DataStore.getVoiceConnection.mockImplementation((guildId, group = 'default') =>
			guildId === existingJoinConfig.guildId && group === existingJoinConfig.group ? existingVoiceConnection : null,
		);

		const newAdapter = createFakeAdapter();
		const newJoinConfig = createJoinConfig();
		existingAdapter.sendPayload.mockReturnValue(false);
		const newVoiceConnection = createVoiceConnection(newJoinConfig, {
			debug: false,
			adapterCreator: newAdapter.creator,
		});
		expect(DataStore.getVoiceConnection).toHaveBeenCalledWith(newJoinConfig.guildId, newJoinConfig.group);
		expect(DataStore.trackVoiceConnection).not.toHaveBeenCalled();
		expect(DataStore.untrackVoiceConnection).not.toHaveBeenCalled();
		expect(newAdapter.creator).not.toHaveBeenCalled();
		expect(existingAdapter.sendPayload).toHaveBeenCalledWith(mockPayload);
		expect(newVoiceConnection).toEqual(existingVoiceConnection);
		expect(newVoiceConnection.state.status).toEqual(VoiceConnectionStatus.Disconnected);
	});
});

describe('VoiceConnection#addServerPacket', () => {
	test('Stores the packet and attempts to configure networking', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		voiceConnection.configureNetworking = jest.fn();
		const dummy = {
			endpoint: 'discord.com',
			guild_id: 123,
			token: 'abc',
		} as any;
		voiceConnection['addServerPacket'](dummy);
		expect(voiceConnection['packets'].server).toEqual(dummy);
		expect(voiceConnection.configureNetworking).toHaveBeenCalled();
	});

	test('Overwrites existing packet', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		voiceConnection['packets'].server = Symbol('old') as any;
		voiceConnection.configureNetworking = jest.fn();
		const dummy = {
			endpoint: 'discord.com',
			guild_id: 123,
			token: 'abc',
		} as any;
		voiceConnection['addServerPacket'](dummy);
		expect(voiceConnection['packets'].server).toEqual(dummy);
		expect(voiceConnection.configureNetworking).toHaveBeenCalled();
	});

	test('Disconnects when given a null endpoint', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		voiceConnection['packets'].server = Symbol('old') as any;
		voiceConnection.configureNetworking = jest.fn();
		const dummy = {
			endpoint: null,
			guild_id: 123,
			token: 'abc',
		} as any;
		voiceConnection['addServerPacket'](dummy);
		expect(voiceConnection['packets'].server).toEqual(dummy);
		expect(voiceConnection.configureNetworking).not.toHaveBeenCalled();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Disconnected);
	});
});

describe('VoiceConnection#addStatePacket', () => {
	test('State is assigned to joinConfig', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		voiceConnection['addStatePacket']({
			self_deaf: true,
			self_mute: true,
			channel_id: '123',
		} as any);

		expect(voiceConnection.joinConfig).toMatchObject({
			selfDeaf: true,
			selfMute: true,
			channelId: '123',
		});

		voiceConnection['addStatePacket']({
			self_mute: false,
		} as any);

		expect(voiceConnection.joinConfig).toMatchObject({
			selfDeaf: true,
			selfMute: false,
			channelId: '123',
		});
	});
});

describe('VoiceConnection#configureNetworking', () => {
	test('Only creates Networking instance when both packets are present and not destroyed', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);

		voiceConnection.configureNetworking();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
		const adapter = (voiceConnection.state as VoiceConnectionSignallingState).adapter;

		const state = {
			session_id: 'abc',
			user_id: '123',
		} as any;

		const server = {
			endpoint: 'def',
			guild_id: '123',
			token: 'xyz',
		} as any;

		Object.assign(voiceConnection['packets'], { state, server: undefined });
		voiceConnection.configureNetworking();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
		expect(Networking.Networking).toHaveBeenCalledTimes(0);

		Object.assign(voiceConnection['packets'], { state: undefined, server });
		voiceConnection.configureNetworking();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
		expect(Networking.Networking).toHaveBeenCalledTimes(0);

		Object.assign(voiceConnection['packets'], { state, server });
		voiceConnection.state = { status: VoiceConnectionStatus.Destroyed };
		voiceConnection.configureNetworking();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);
		expect(Networking.Networking).toHaveBeenCalledTimes(0);

		voiceConnection.state = { status: VoiceConnectionStatus.Signalling, adapter };
		voiceConnection.configureNetworking();
		expect(Networking.Networking).toHaveBeenCalledTimes(1);
		expect(Networking.Networking).toHaveBeenCalledWith(
			{
				endpoint: server.endpoint,
				serverId: server.guild_id,
				token: server.token,
				sessionId: state.session_id,
				userId: state.user_id,
			},
			false,
		);
		expect(voiceConnection.state).toMatchObject({
			status: VoiceConnectionStatus.Connecting,
			adapter,
		});
		expect((voiceConnection.state as unknown as VoiceConnectionConnectingState).networking).toBeInstanceOf(
			Networking.Networking,
		);
	});
});

describe('VoiceConnection#onNetworkingClose', () => {
	test('Does nothing in destroyed state', () => {
		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = {
			status: VoiceConnectionStatus.Destroyed,
		};
		voiceConnection['onNetworkingClose'](1_000);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);
		expect(adapter.sendPayload).not.toHaveBeenCalled();
	});

	test('Disconnects for code 4014', () => {
		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection['onNetworkingClose'](4_014);
		expect(voiceConnection.state).toMatchObject({
			status: VoiceConnectionStatus.Disconnected,
			closeCode: 4_014,
		});
		expect(adapter.sendPayload).not.toHaveBeenCalled();
	});

	test('Attempts rejoin for codes != 4014', () => {
		const dummyPayload = Symbol('dummy') as any;
		const { voiceConnection, adapter, joinConfig } = createFakeVoiceConnection();
		DataStore.createJoinVoiceChannelPayload.mockImplementation((config) =>
			config === joinConfig ? dummyPayload : undefined,
		);
		voiceConnection['onNetworkingClose'](1_234);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
		expect(adapter.sendPayload).toHaveBeenCalledWith(dummyPayload);
		expect(voiceConnection.rejoinAttempts).toEqual(1);
	});

	test('Attempts rejoin for codes != 4014 (with adapter failure)', () => {
		const dummyPayload = Symbol('dummy') as any;
		const { voiceConnection, adapter, joinConfig } = createFakeVoiceConnection();
		DataStore.createJoinVoiceChannelPayload.mockImplementation((config) =>
			config === joinConfig ? dummyPayload : undefined,
		);
		adapter.sendPayload.mockReturnValue(false);
		voiceConnection['onNetworkingClose'](1_234);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Disconnected);
		expect(adapter.sendPayload).toHaveBeenCalledWith(dummyPayload);
		expect(voiceConnection.rejoinAttempts).toEqual(1);
	});
});

describe('VoiceConnection#onNetworkingStateChange', () => {
	test('Does nothing when status code identical', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const stateSetter = jest.spyOn(voiceConnection, 'state', 'set');
		voiceConnection['onNetworkingStateChange'](
			{ code: _Networking.NetworkingStatusCode.Ready } as any,
			{ code: _Networking.NetworkingStatusCode.Ready } as any,
		);
		voiceConnection['onNetworkingStateChange'](
			{ code: _Networking.NetworkingStatusCode.Closed } as any,
			{ code: _Networking.NetworkingStatusCode.Closed } as any,
		);
		expect(stateSetter).not.toHaveBeenCalled();
	});

	test('Does nothing when not in Ready or Connecting states', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const stateSetter = jest.spyOn(voiceConnection, 'state', 'set');
		const call = [
			{ code: _Networking.NetworkingStatusCode.Ready } as any,
			{ code: _Networking.NetworkingStatusCode.Closed } as any,
		];
		voiceConnection['_state'] = { status: VoiceConnectionStatus.Signalling } as any;
		voiceConnection['onNetworkingStateChange'](call[0], call[1]);
		voiceConnection['_state'] = { status: VoiceConnectionStatus.Disconnected } as any;
		voiceConnection['onNetworkingStateChange'](call[0], call[1]);
		voiceConnection['_state'] = { status: VoiceConnectionStatus.Destroyed } as any;
		voiceConnection['onNetworkingStateChange'](call[0], call[1]);
		expect(stateSetter).not.toHaveBeenCalled();
	});

	test('Transitions to Ready', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const stateSetter = jest.spyOn(voiceConnection, 'state', 'set');
		voiceConnection['_state'] = {
			...(voiceConnection.state as VoiceConnectionSignallingState),
			status: VoiceConnectionStatus.Connecting,
			networking: new Networking.Networking({} as any, false),
		};

		voiceConnection['onNetworkingStateChange'](
			{ code: _Networking.NetworkingStatusCode.Closed } as any,
			{ code: _Networking.NetworkingStatusCode.Ready } as any,
		);

		expect(stateSetter).toHaveBeenCalledTimes(1);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Ready);
	});

	test('Transitions to Connecting', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const stateSetter = jest.spyOn(voiceConnection, 'state', 'set');
		voiceConnection['_state'] = {
			...(voiceConnection.state as VoiceConnectionSignallingState),
			status: VoiceConnectionStatus.Connecting,
			networking: new Networking.Networking({} as any, false),
		};

		voiceConnection['onNetworkingStateChange'](
			{ code: _Networking.NetworkingStatusCode.Ready } as any,
			{ code: _Networking.NetworkingStatusCode.Identifying } as any,
		);

		expect(stateSetter).toHaveBeenCalledTimes(1);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Connecting);
	});
});

describe('VoiceConnection#destroy', () => {
	test('Throws when in Destroyed state', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		voiceConnection.state = { status: VoiceConnectionStatus.Destroyed };
		expect(() => voiceConnection.destroy()).toThrow();
	});

	test('Cleans up in a valid, destroyable state', () => {
		const { voiceConnection, joinConfig, adapter } = createFakeVoiceConnection();
		DataStore.getVoiceConnection.mockImplementation((guildId, group = 'default') =>
			guildId === joinConfig.guildId && group === joinConfig.group ? voiceConnection : undefined,
		);
		const dummy = Symbol('dummy');
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => dummy as any);
		voiceConnection.destroy();
		expect(DataStore.getVoiceConnection).toHaveReturnedWith(voiceConnection);
		expect(DataStore.untrackVoiceConnection).toHaveBeenCalledWith(voiceConnection);
		expect(DataStore.createJoinVoiceChannelPayload.mock.calls[0][0]).toMatchObject({
			channelId: null,
			guildId: joinConfig.guildId,
		});
		expect(adapter.sendPayload).toHaveBeenCalledWith(dummy);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);
	});
});

describe('VoiceConnection#disconnect', () => {
	test('Fails in Destroyed and Signalling states', () => {
		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = { status: VoiceConnectionStatus.Destroyed };
		expect(voiceConnection.disconnect()).toEqual(false);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);

		voiceConnection.state = { status: VoiceConnectionStatus.Signalling, adapter };
		expect(voiceConnection.disconnect()).toEqual(false);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
	});

	test('Disconnects - available adapter', () => {
		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = {
			status: VoiceConnectionStatus.Ready,
			adapter,
			networking: new Networking.Networking({} as any, false),
		};
		const leavePayload = Symbol('dummy');
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => leavePayload as any);
		expect(voiceConnection.disconnect()).toEqual(true);
		expect(voiceConnection.joinConfig).toMatchObject({
			channelId: null,
			guildId: '2',
			selfDeaf: true,
			selfMute: false,
		});
		expect(DataStore.createJoinVoiceChannelPayload).toHaveBeenCalledWith(voiceConnection.joinConfig);
		expect(adapter.sendPayload).toHaveBeenCalledWith(leavePayload);
		expect(voiceConnection.state).toMatchObject({
			status: VoiceConnectionStatus.Disconnected,
			reason: VoiceConnectionDisconnectReason.Manual,
		});
	});

	test('Disconnects - unavailable adapter', () => {
		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = {
			status: VoiceConnectionStatus.Ready,
			adapter,
			networking: new Networking.Networking({} as any, false),
		};
		adapter.sendPayload.mockImplementation(() => false);
		expect(voiceConnection.disconnect()).toEqual(false);
		expect(voiceConnection.state).toMatchObject({
			status: VoiceConnectionStatus.Disconnected,
			reason: VoiceConnectionDisconnectReason.AdapterUnavailable,
		});
	});
});

describe('VoiceConnection#rejoin', () => {
	test('Rejoins in a disconnected state', () => {
		const dummy = Symbol('dummy') as any;
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => dummy);

		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = {
			...(voiceConnection.state as VoiceConnectionSignallingState),
			status: VoiceConnectionStatus.Disconnected,
			reason: VoiceConnectionDisconnectReason.WebSocketClose,
			closeCode: 1_000,
		};
		expect(voiceConnection.rejoin()).toEqual(true);
		expect(voiceConnection.rejoinAttempts).toEqual(1);
		expect(adapter.sendPayload).toHaveBeenCalledWith(dummy);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Signalling);
	});

	test('Rejoins in a ready state', () => {
		const dummy = Symbol('dummy') as any;
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => dummy);

		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = {
			...(voiceConnection.state as VoiceConnectionReadyState),
			status: VoiceConnectionStatus.Ready,
		};
		expect(voiceConnection.rejoin()).toEqual(true);
		expect(voiceConnection.rejoinAttempts).toEqual(0);
		expect(adapter.sendPayload).toHaveBeenCalledWith(dummy);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Ready);
	});

	test('Stays in the disconnected state when the adapter fails', () => {
		const dummy = Symbol('dummy') as any;
		DataStore.createJoinVoiceChannelPayload.mockImplementation(() => dummy);

		const { voiceConnection, adapter } = createFakeVoiceConnection();
		voiceConnection.state = {
			...(voiceConnection.state as VoiceConnectionSignallingState),
			status: VoiceConnectionStatus.Disconnected,
			reason: VoiceConnectionDisconnectReason.WebSocketClose,
			closeCode: 1_000,
		};
		adapter.sendPayload.mockReturnValue(false);
		expect(voiceConnection.rejoin()).toEqual(false);
		expect(voiceConnection.rejoinAttempts).toEqual(1);
		expect(adapter.sendPayload).toHaveBeenCalledWith(dummy);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Disconnected);
	});
});

describe('VoiceConnection#subscribe', () => {
	test('Does nothing in Destroyed state', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const player = new AudioPlayer.AudioPlayer();
		player['subscribe'] = jest.fn();
		voiceConnection.state = { status: VoiceConnectionStatus.Destroyed };
		expect(voiceConnection.subscribe(player)).toBeUndefined();
		expect(player['subscribe']).not.toHaveBeenCalled();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);
	});

	test('Subscribes in a live state', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const adapter = (voiceConnection.state as VoiceConnectionSignallingState).adapter;
		const player = new AudioPlayer.AudioPlayer();
		const dummy = Symbol('dummy');
		player['subscribe'] = jest.fn().mockImplementation(() => dummy);
		expect(voiceConnection.subscribe(player)).toEqual(dummy);
		expect(player['subscribe']).toHaveBeenCalledWith(voiceConnection);
		expect(voiceConnection.state).toMatchObject({
			status: VoiceConnectionStatus.Signalling,
			adapter,
		});
	});
});

describe('VoiceConnection#onSubscriptionRemoved', () => {
	test('Does nothing in Destroyed state', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const subscription = new PlayerSubscription(voiceConnection, new AudioPlayer.AudioPlayer());
		subscription.unsubscribe = jest.fn();

		voiceConnection.state = { status: VoiceConnectionStatus.Destroyed };
		voiceConnection['onSubscriptionRemoved'](subscription);
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);
		expect(subscription.unsubscribe).not.toHaveBeenCalled();
	});

	test('Does nothing when subscription is not the same as the stored one', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const subscription = new PlayerSubscription(voiceConnection, new AudioPlayer.AudioPlayer());
		subscription.unsubscribe = jest.fn();

		voiceConnection.state = { ...(voiceConnection.state as VoiceConnectionSignallingState), subscription };
		voiceConnection['onSubscriptionRemoved'](Symbol('new subscription') as any);
		expect(voiceConnection.state).toMatchObject({
			status: VoiceConnectionStatus.Signalling,
			subscription,
		});
		expect(subscription.unsubscribe).not.toHaveBeenCalled();
	});

	test('Unsubscribes in a live state with matching subscription', () => {
		const { voiceConnection } = createFakeVoiceConnection();
		const subscription = new PlayerSubscription(voiceConnection, new AudioPlayer.AudioPlayer());
		subscription.unsubscribe = jest.fn();

		voiceConnection.state = { ...(voiceConnection.state as VoiceConnectionSignallingState), subscription };
		voiceConnection['onSubscriptionRemoved'](subscription);
		expect(voiceConnection.state).toEqual({
			...voiceConnection.state,
			subscription: undefined,
		});
		expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
	});

	describe('updateReceiveBindings', () => {
		test('Applies and removes udp listeners', () => {
			// Arrange
			const ws = new EventEmitter() as any;

			const oldNetworking = new Networking.Networking({} as any, false);
			oldNetworking.state = {
				code: _Networking.NetworkingStatusCode.Ready,
				connectionData: {} as any,
				connectionOptions: {} as any,
				udp: new EventEmitter() as any,
				ws,
			};

			const newNetworking = new Networking.Networking({} as any, false);
			newNetworking.state = {
				...oldNetworking.state,
				udp: new EventEmitter() as any,
			};

			const { voiceConnection } = createFakeVoiceConnection();

			// Act
			voiceConnection['updateReceiveBindings'](newNetworking.state, oldNetworking.state);

			// Assert
			expect(oldNetworking.state.udp.listenerCount('message')).toEqual(0);
			expect(newNetworking.state.udp.listenerCount('message')).toEqual(1);
			expect(voiceConnection.receiver.connectionData).toEqual(newNetworking.state.connectionData);
		});

		test('Applies and removes ws listeners', () => {
			// Arrange
			const udp = new EventEmitter() as any;

			const oldNetworking = new Networking.Networking({} as any, false);
			oldNetworking.state = {
				code: _Networking.NetworkingStatusCode.Ready,
				connectionData: {} as any,
				connectionOptions: {} as any,
				udp,
				ws: new EventEmitter() as any,
			};

			const newNetworking = new Networking.Networking({} as any, false);
			newNetworking.state = {
				...oldNetworking.state,
				ws: new EventEmitter() as any,
			};

			const { voiceConnection } = createFakeVoiceConnection();

			// Act
			voiceConnection['updateReceiveBindings'](newNetworking.state, oldNetworking.state);

			// Assert
			expect(oldNetworking.state.ws.listenerCount('packet')).toEqual(0);
			expect(newNetworking.state.ws.listenerCount('packet')).toEqual(1);
			expect(voiceConnection.receiver.connectionData).toEqual(newNetworking.state.connectionData);
		});

		test('Applies initial listeners', () => {
			// Arrange

			const newNetworking = new Networking.Networking({} as any, false);
			newNetworking.state = {
				code: _Networking.NetworkingStatusCode.Ready,
				connectionData: {} as any,
				connectionOptions: {} as any,
				udp: new EventEmitter() as any,
				ws: new EventEmitter() as any,
			};

			const { voiceConnection } = createFakeVoiceConnection();

			// Act
			voiceConnection['updateReceiveBindings'](newNetworking.state, undefined);

			// Assert
			expect(newNetworking.state.ws.listenerCount('packet')).toEqual(1);
			expect(newNetworking.state.udp.listenerCount('message')).toEqual(1);
			expect(voiceConnection.receiver.connectionData).toEqual(newNetworking.state.connectionData);
		});
	});
});

describe('Adapter', () => {
	test('onVoiceServerUpdate', () => {
		const { adapter, voiceConnection } = createFakeVoiceConnection();
		voiceConnection['addServerPacket'] = jest.fn();
		const dummy = Symbol('dummy') as any;
		adapter.libMethods.onVoiceServerUpdate!(dummy);
		expect(voiceConnection['addServerPacket']).toHaveBeenCalledWith(dummy);
	});

	test('onVoiceStateUpdate', () => {
		const { adapter, voiceConnection } = createFakeVoiceConnection();
		voiceConnection['addStatePacket'] = jest.fn();
		const dummy = Symbol('dummy') as any;
		adapter.libMethods.onVoiceStateUpdate!(dummy);
		expect(voiceConnection['addStatePacket']).toHaveBeenCalledWith(dummy);
	});

	test('destroy', () => {
		const { adapter, voiceConnection } = createFakeVoiceConnection();
		adapter.libMethods.destroy!();
		expect(voiceConnection.state.status).toEqual(VoiceConnectionStatus.Destroyed);
		expect(adapter.sendPayload).not.toHaveBeenCalled();
	});
});

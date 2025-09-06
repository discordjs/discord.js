/* eslint-disable tsdoc/syntax */
import { randomUUID } from 'node:crypto';
import { clearTimeout, setTimeout } from 'node:timers';
import { URLSearchParams } from 'node:url';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type {
	RESTPostOAuth2AccessTokenResult,
	RESTPostOAuth2AccessTokenURLEncodedData,
	RPCCertifiedDevice,
	RPCCreateChannelInviteResultData,
	RPCGetChannelResultData,
	RPCGetChannelsResultData,
	RPCGetGuildResultData,
	RPCGetGuildsResultData,
	RPCGetImageArgs,
	RPCGetVoiceSettingsResultData,
	RPCMessage,
	RPCMessagePayload,
	RPCOAuth2Application,
	RPCSelectTextChannelArgs,
	RPCSelectTextChannelResultData,
	RPCSelectVoiceChannelArgs,
	RPCSelectVoiceChannelResultData,
	RPCSetActivityArgs,
	RPCSetCertifiedDevicesResultData,
	RPCSetUserVoiceSettingsArgs,
	RPCSetUserVoiceSettingsResultData,
	RPCSetVoiceSettingsArgs,
	RPCUnsubscribeResultData,
	APIUser,
	OAuth2Scopes,
	Snowflake,
} from 'discord-api-types/v10';
import { RPCEvents, RPCCommands, Routes } from 'discord-api-types/v10';
import { RPCEventError } from './RPCEventError.js';
import type {
	EventAndArgsParameters,
	MappedRPCCommandsArgs,
	MappedRPCCommandsResultsData,
	MappedRPCEventsDispatchData,
	NullableFields,
	RPCCallableCommands,
} from './constants.js';
import { Events } from './constants.js';
import { IPCTransport } from './ipc.js';
import { getPid, mergeRPCLoginOptions } from './util.js';

export interface RPCLoginOptions {
	/**
	 * Access Token
	 */
	accessToken: string;
	/**
	 * Client id
	 */
	clientId: string;
	/**
	 * Client Secret
	 */
	clientSecret: string;
	/**
	 * https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
	 *
	 * for authorization requests
	 */
	prompt?: 'consent' | 'none';
	/**
	 * https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
	 *
	 * for authorization requests
	 */
	redirectUri?: string;
	/**
	 * An array of scopes
	 */
	scopes: OAuth2Scopes[];
	/**
	 * the client username
	 */
	username: string;
}

/**
 * The client for interacting with Discord RPC
 */
export class RPCClient extends AsyncEventEmitter<MappedRPCEventsDispatchData> {
	public options: Partial<RPCLoginOptions>;

	public accessToken: string | null;

	public clientId: string | null;

	public application: RPCOAuth2Application | null;

	public user: APIUser | null;

	public transport: IPCTransport;

	/**
	 * Map of nonces being expected from the transport
	 */
	readonly #expected_nonces: Map<
		string,
		{ reject(this: void, reason?: unknown): void; resolve(this: void, value: unknown): void }
	>;

	/**
	 * Promise for connection
	 */
	#connectPromise: Promise<RPCClient> | undefined;

	public constructor(options: Partial<RPCLoginOptions> = {}) {
		super();

		this.options = options;

		this.accessToken = null;
		this.clientId = null;
		this.application = null;
		this.user = null;

		this.transport = new IPCTransport(this);
		this.transport.on('message', this.#onRpcMessage.bind(this));

		this.#expected_nonces = new Map();

		this.#connectPromise = undefined;
	}

	/**
	 * Search and connect to RPC
	 */
	public async connect(clientId: string): Promise<RPCClient> {
		if (this.#connectPromise) {
			return this.#connectPromise;
		}

		const { promise, resolve, reject } = Promise.withResolvers<RPCClient>();
		this.#connectPromise = promise;
		this.clientId = clientId;
		const timeout = setTimeout(() => reject(new Error('RPC_CONNECTION_TIMEOUT')), 10e3);
		timeout.unref();
		this.once(RPCEvents.Ready, () => {
			clearTimeout(timeout);
			resolve(this);
		});

		this.transport.once('close', () => {
			for (const exp_nonce of this.#expected_nonces.values()) {
				exp_nonce.reject(new RPCEventError('connection closed'));
			}

			this.emit(Events.Disconnected);
			reject(new Error('connection closed'));
		});

		try {
			await this.transport.connect();
		} catch (error) {
			reject(error);
		}

		return this.#connectPromise;
	}

	/**
	 * Performs authentication flow. Automatically calls Client#connect if needed.
	 *
	 * @param options - Options for authentication.
	 * @example
	 * logging in with a client id and secret
	 * ```ts
	 * client.login({ clientId: '1234567', clientSecret: 'abcdef123' });
	 * ```
	 */
	public async login(options: Partial<RPCLoginOptions> = {}): Promise<RPCClient> {
		const finalizedOptions = mergeRPCLoginOptions(options, this.options);
		const { clientId } = finalizedOptions;
		if (!clientId) {
			throw new Error('A client id must be provided to login');
		}

		await this.connect(clientId);

		const { scopes } = finalizedOptions;
		if (!scopes) {
			this.emit(Events.ApplicationReady);
			return this;
		}

		let { accessToken } = finalizedOptions;
		if (!accessToken) {
			accessToken = await this.authorize(finalizedOptions);
		}

		return this.authenticate(accessToken!);
	}

	/**
	 * Request
	 *
	 * @param cmd - Command
	 * @param args - Arguments
	 * @param evt - Event
	 */
	async #request<Cmd extends RPCCallableCommands = RPCCallableCommands>(
		cmd: Cmd,
		args: MappedRPCCommandsArgs[Cmd] = {} as MappedRPCCommandsArgs[Cmd],
		evt?: RPCEvents,
	) {
		return new Promise(
			(resolve: (value: MappedRPCCommandsResultsData[Cmd]) => void, reject: (reason: RPCEventError) => void) => {
				const nonce = randomUUID();
				const payload: { args: MappedRPCCommandsArgs[Cmd]; cmd: Cmd; evt?: RPCEvents; nonce: string } = {
					cmd,
					args,
					nonce,
				};
				if (cmd === RPCCommands.Subscribe || cmd === RPCCommands.Unsubscribe) {
					payload.evt = evt!;
				}

				this.transport.send(payload as RPCMessagePayload);
				this.#expected_nonces.set(nonce, { resolve, reject });
			},
		);
	}

	/**
	 * Request but public
	 */
	public async request<Cmd extends RPCCallableCommands>(
		cmd: Cmd,
		args: MappedRPCCommandsArgs[Cmd],
		evt?: RPCEvents,
	): Promise<MappedRPCCommandsResultsData[Cmd]> {
		return this.#request(cmd, args, evt);
	}

	/**
	 * Message handler
	 *
	 * @param message - message
	 */
	#onRpcMessage(message: RPCMessage): void {
		if (message.cmd === RPCCommands.Dispatch && message.evt === RPCEvents.Ready) {
			if (message.data.user) {
				this.user = message.data.user;
			}

			this.emit(RPCEvents.Ready, message.data);
		} else if (message.cmd === RPCCommands.Dispatch) {
			this.emit(message.evt, message.data);
		} else {
			if (!this.#expected_nonces.has(message.nonce)) {
				return;
			}

			const { resolve, reject } = this.#expected_nonces.get(message.nonce)!;
			if ('evt' in message && message.evt === RPCEvents.Error) {
				reject(new RPCEventError(message.data));
			} else {
				resolve(message.data);
			}

			this.#expected_nonces.delete(message.nonce);
		}
	}

	/**
	 * Authorize
	 *
	 * @param options - authorization options
	 * @param options.scopes - An array of scopes
	 * @param options.clientId - Client's id
	 * @param options.clientSecret - Client's Secret
	 * @param options.redirectUri - URI to redirect to
	 */
	private async authorize({
		scopes,
		clientId,
		clientSecret,
		redirectUri,
	}: Partial<RPCLoginOptions> = {}): Promise<string> {
		const { code } = await this.#request(RPCCommands.Authorize, {
			scopes: scopes!,
			client_id: clientId!,
		});

		const response = (await fetch(`https://discord.com/api${Routes.oauth2TokenExchange()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				client_id: this.clientId!,
				client_secret: clientSecret!,
				code,
				grant_type: 'authorization_code',
				redirect_uri: redirectUri!,
			} satisfies RESTPostOAuth2AccessTokenURLEncodedData),
		}).then(async (res) => res.json())) as RESTPostOAuth2AccessTokenResult;

		if (!('access_token' in response)) {
			throw new Error(response);
		}

		return response.access_token;
	}

	/**
	 * Authenticate
	 *
	 * @param accessToken - access token
	 */
	public async authenticate(accessToken: string): Promise<this> {
		const { application, user } = await this.#request(RPCCommands.Authenticate, { access_token: accessToken });
		this.accessToken = accessToken;
		this.application = application;
		this.user = user;
		this.emit(Events.ApplicationReady);
		return this;
	}

	/**
	 * Fetch a guild
	 *
	 * @param id - Guild id
	 * @param timeout - Timeout request
	 */
	public async getGuild(id: Snowflake, timeout: number): Promise<RPCGetGuildResultData> {
		return this.#request(RPCCommands.GetGuild, { guild_id: id, timeout });
	}

	/**
	 * Fetch all guilds
	 *
	 * @param timeout - Timeout request
	 */
	public async getGuilds(timeout: number): Promise<RPCGetGuildsResultData> {
		return this.#request(RPCCommands.GetGuilds, { timeout });
	}

	/**
	 * Get a channel
	 *
	 * @param id - Channel id
	 */
	public async getChannel(id: Snowflake): Promise<RPCGetChannelResultData> {
		return this.#request(RPCCommands.GetChannel, { channel_id: id });
	}

	/**
	 * Get all channels
	 *
	 * @param id - Guild id
	 */
	public async getChannels(id: Snowflake): Promise<RPCGetChannelsResultData['channels']> {
		const { channels } = await this.#request(RPCCommands.GetChannels, { guild_id: id });
		return channels;
	}

	/**
	 * Create channel invite
	 *
	 * @param id - Channel id
	 */
	public async createChannelInvite(id: Snowflake): Promise<RPCCreateChannelInviteResultData> {
		return this.#request(RPCCommands.CreateChannelInvite, { channel_id: id });
	}

	/**
	 * Tell discord which devices are certified
	 *
	 * @param devices - Certified devices to send to discord
	 */
	public async setCertifiedDevices(devices: RPCCertifiedDevice[]): Promise<RPCSetCertifiedDevicesResultData> {
		return this.#request(RPCCommands.SetCertifiedDevices, {
			devices,
		});
	}

	/**
	 * Set the voice settings for a user, by id
	 *
	 * @param id - Id of the user to set
	 * @param settings - Settings to set
	 */
	public async setUserVoiceSettings(
		id: Snowflake,
		settings: Omit<Partial<RPCSetUserVoiceSettingsArgs>, 'user_id'>,
	): Promise<RPCSetUserVoiceSettingsResultData> {
		return this.#request(RPCCommands.SetUserVoiceSettings, {
			user_id: id,
			...settings,
		});
	}

	/**
	 * Move the user to a voice channel
	 *
	 * @param id - Id of the voice channel
	 * @param options - Options
	 * @param options.timeout - Timeout for the command
	 * @param options.force - Force this move. This should only be done if you
	 * have explicit permission from the user.
	 */
	public async selectVoiceChannel(
		id: Snowflake,
		{ timeout, force = false }: Omit<RPCSelectVoiceChannelArgs, 'channel_id'> = {},
	): Promise<RPCSelectVoiceChannelResultData> {
		const args: RPCSelectVoiceChannelArgs = { channel_id: id, force };
		if (timeout) {
			args.timeout = timeout;
		}

		return this.#request(RPCCommands.SelectVoiceChannel, args);
	}

	/**
	 * Move the user to a text channel
	 *
	 * @param id - Id of the voice channel
	 * @param options - Options
	 * @param options.timeout - Timeout for the command
	 * have explicit permission from the user.
	 */
	public async selectTextChannel(
		id: Snowflake,
		{ timeout }: Omit<RPCSelectTextChannelArgs, 'channel_id'> = {},
	): Promise<RPCSelectTextChannelResultData> {
		const args: RPCSelectTextChannelArgs = { channel_id: id };
		if (timeout) {
			args.timeout = timeout;
		}

		return this.#request(RPCCommands.SelectTextChannel, args);
	}

	/**
	 * Get current voice settings
	 *
	 */
	public async getVoiceSettings(): Promise<RPCGetVoiceSettingsResultData> {
		return this.#request(RPCCommands.GetVoiceSettings);
	}

	/**
	 * Set current voice settings, overriding the current settings until this session disconnects.
	 * This also locks the settings for any other rpc sessions which may be connected.
	 *
	 * @param args - Settings
	 */
	public async setVoiceSettings(args: RPCSetVoiceSettingsArgs): Promise<unknown> {
		return this.#request(RPCCommands.SetVoiceSettings, args);
	}

	/**
	 * Sets the presence for the logged in user.
	 *
	 * @param activity - The rich presence to pass.
	 * @param pid - The application's process ID. Defaults to the executing process' PID.
	 */
	public async setActivity(
		activity: RPCSetActivityArgs['activity'] = {},
		pid: number | null = getPid(),
	): Promise<unknown> {
		const newActivity: NullableFields<RPCSetActivityArgs['activity']> = {
			...activity,
			instance: Boolean(activity.instance),
		};

		if (activity.timestamps) {
			newActivity.timestamps = activity.timestamps;
			if ('start' in newActivity.timestamps && newActivity.timestamps.start > 2_147_483_647_000) {
				throw new RangeError('timestamps.start must fit into a unix timestamp');
			}

			if ('end' in newActivity.timestamps && newActivity.timestamps.end > 2_147_483_647_000) {
				throw new RangeError('timestamps.end must fit into a unix timestamp');
			}
		}

		if ('assets' in activity) {
			newActivity.assets = activity.assets;
		}

		if ('party' in activity) {
			newActivity.party = activity.party;
		}

		if ('secrets' in activity) {
			newActivity.secrets = activity.secrets;
		}

		return this.#request(RPCCommands.SetActivity, {
			pid: pid ?? 0,
			activity: newActivity as Exclude<RPCSetActivityArgs['activity'], undefined>,
		});
	}

	/**
	 * Clears the currently set presence, if any. This will hide the "Playing X" message
	 * displayed below the user's name.
	 *
	 * @param pid - The application's process ID. Defaults to the executing process' PID.
	 */
	public async clearActivity(pid: number | null = getPid()): Promise<unknown> {
		return this.#request(RPCCommands.SetActivity, {
			pid: pid ?? 0,
		});
	}

	/**
	 * Invite a user to join the game the RPC user is currently playing
	 *
	 * @param userId - The id of the user to invite
	 */
	public async sendJoinInvite(userId: Snowflake): Promise<unknown> {
		return this.#request(RPCCommands.SendActivityJoinInvite, {
			user_id: userId,
		});
	}

	/**
	 * Reject a join request from a user
	 *
	 * @param userId - The id of the user whose request you wish to reject
	 */
	public async closeJoinRequest(userId: Snowflake): Promise<unknown> {
		return this.#request(RPCCommands.CloseActivityJoinRequest, {
			user_id: userId,
		});
	}

	/**
	 * requires `relationships.read` scope
	 */
	public async getRelationships() {
		return this.#request(RPCCommands.GetRelationships);
	}

	/**
	 * Fetches a user
	 */
	public async getUser(id: Snowflake) {
		return this.#request(RPCCommands.GetUser, { id });
	}

	/**
	 * Fetches a user's profile picture
	 */
	public async getImage({ id, format, size }: Omit<RPCGetImageArgs, 'type'>): Promise<string> {
		return (await this.#request(RPCCommands.GetImage, { type: 'user', id, format, size })).data_url;
	}

	/**
	 * Subscribe to an event
	 *
	 * @param event - Name of event e.g. `MESSAGE_CREATE`
	 * @param args - Args for event e.g. `{ channel_id: '1234' }`
	 */
	public async subscribe<Evt extends RPCEvents>(
		...[event, args]: EventAndArgsParameters<Evt>
	): Promise<{ unsubscribe(): Promise<RPCUnsubscribeResultData> }> {
		await this.#request(RPCCommands.Subscribe, args, event);
		return {
			unsubscribe: async () => this.#request(RPCCommands.Unsubscribe, args, event),
		};
	}

	/**
	 * Destroy the client
	 */
	public async destroy() {
		await this.transport.close();
	}
}

/* eslint-disable tsdoc/syntax */
import { randomUUID } from 'node:crypto';
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
	RPCAuthorizeArgs,
	RPCCommandSubscribePayload,
	RPCSubscribeResultData,
} from 'discord-api-types/v10';
import { RPCEvents, RPCCommands, Routes } from 'discord-api-types/v10';
import { RPCEventError } from './RPCEventError.js';
import type {
	EventAndArgsParameters,
	MappedRPCCommandsArgs,
	MappedRPCCommandsResultsData,
	MappedRPCEventsDispatchData,
	RPCCallableCommands,
} from './constants.js';
import { Events } from './constants.js';
import { IPCTransport } from './ipc.js';
import { getPid } from './util.js';

export interface RPCClientOptions {
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
	scopes?: OAuth2Scopes[];
	/**
	 * the client username
	 */
	username?: string;
}

export interface RPCLoginOptions {
	/**
	 * Access Token
	 */
	accessToken?: string;
	/**
	 * Client id
	 */
	clientId: string;
	/**
	 * Client Secret
	 */
	clientSecret?: string;
}

export interface RequestOptions {
	signal?: AbortSignal;
}

/**
 * The client for interacting with Discord RPC
 */
export class RPCClient extends AsyncEventEmitter<MappedRPCEventsDispatchData> {
	public options: RPCClientOptions;

	public accessToken: string;

	public clientId: string;

	public clientSecret: string;

	public readyTimestamp: number | null;

	public application: RPCOAuth2Application | null;

	public user: APIUser | null;

	public transport: IPCTransport;

	/**
	 * Map of nonces being expected from the transport
	 */
	readonly #expectedNonces: Map<
		string,
		{ reject(this: void, reason?: unknown): void; resolve(this: void, value: unknown): void }
	>;

	public constructor(options?: RPCClientOptions);
	public constructor(options: RPCClientOptions = {}) {
		super();

		this.options = options;

		this.accessToken = '';
		this.clientId = '';
		this.clientSecret = '';
		this.readyTimestamp = null;
		this.application = null;
		this.user = null;

		this.transport = new IPCTransport(this);
		this.transport.on('message', this.#onRpcMessage.bind(this));

		this.#expectedNonces = new Map();
	}

	public get readyAt() {
		if (this.readyTimestamp === null) return null;
		return new Date(this.readyTimestamp);
	}

	public get ready() {
		return this.readyTimestamp !== null;
	}

	/**
	 * Search and connect to RPC
	 */
	public async connect(options?: RequestOptions) {
		const { promise, resolve, reject } = Promise.withResolvers<RPCClient>();
		const signal = options?.signal ?? AbortSignal.timeout(10e3);

		const onReady = () => {
			this.readyTimestamp = Date.now();
			resolve(this);
		};

		const onClose = (data: unknown) => {
			for (const exp_nonce of this.#expectedNonces.values()) {
				exp_nonce.reject(new RPCEventError('connection closed'));
			}

			this.#expectedNonces.clear();

			this.readyTimestamp = null;

			this.emit(Events.Disconnected);
			reject(new RPCEventError(JSON.stringify(data)));
		};

		const onAbort = (_: Event, reason?: string) => {
			if (this.listenerCount(RPCEvents.Ready) === 0) return;
			this.removeListener(RPCEvents.Ready, onReady);
			this.transport.removeListener('close', onClose);

			reject(new Error(reason));
		};

		signal.addEventListener('abort', onAbort);

		this.once(RPCEvents.Ready, onReady);

		this.transport.once('close', onClose);

		try {
			await this.transport.connect();
			signal.removeEventListener('abort', onAbort);
		} catch (error) {
			this.readyTimestamp = null;
			this.removeListener(RPCEvents.Ready, onReady);
			this.transport.removeListener('close', onClose);
			reject(error);
		}

		return promise;
	}

	/**
	 * Performs authentication flow. Automatically calls Client#connect if needed.
	 *
	 * @param options - login options.
	 * @param options.clientId - client Id.
	 * @param options.clientSecret - client Secret (required if scopes are specified in constructor).
	 * @param options.accessToken - Access Token (skips authorization steps).
	 * @example
	 * logging in with a client id and secret
	 * ```ts
	 * client.login({ clientId: '1234567', clientSecret: 'abcdef123' });
	 * ```
	 */
	public async login(
		{ clientId, clientSecret, accessToken }: RPCLoginOptions,
		options?: RequestOptions,
	): Promise<RPCClient> {
		if (!clientId) {
			throw new Error('A client id must be provided to login');
		}

		this.clientId = clientId;

		await this.connect(options);

		if (!this.options.scopes) {
			this.emit(Events.ApplicationReady);
			return this;
		}

		if (accessToken) {
			return this.authenticate(accessToken, options);
		}

		if (!clientSecret) {
			throw new Error('A client secret must be provided for authorization if scopes are included');
		}

		this.clientSecret = clientSecret;

		const authorizeArgs: RPCAuthorizeArgs = { client_id: this.clientId, scopes: this.options.scopes };
		if (this.options.username) authorizeArgs.username = this.options.username;

		return this.authenticate(await this.authorize(authorizeArgs, options), options);
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
		args?: MappedRPCCommandsArgs[Cmd],
		options?: RequestOptions,
		evt?: RPCEvents,
	): Promise<MappedRPCCommandsResultsData[Cmd]>;
	async #request(
		cmd: RPCCommands.Subscribe | RPCCommands.Unsubscribe,
		args: RPCCommandSubscribePayload['args'],
		options: RequestOptions | undefined,
		evt: RPCEvents,
	): Promise<RPCSubscribeResultData | RPCUnsubscribeResultData>;
	async #request<Cmd extends RPCCallableCommands = RPCCallableCommands>(
		cmd: Cmd,
		args: MappedRPCCommandsArgs[Cmd] = {} as MappedRPCCommandsArgs[Cmd],
		options?: RequestOptions,
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
				this.#expectedNonces.set(nonce, { resolve, reject });
				options?.signal?.addEventListener('abort', (_: Event, reason?: string) =>
					reject(new RPCEventError(`${reason}`)),
				);
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
		options?: RequestOptions,
	): Promise<MappedRPCCommandsResultsData[Cmd]> {
		return this.#request(cmd, args, options, evt);
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
			if (!this.#expectedNonces.has(message.nonce)) {
				return;
			}

			const { resolve, reject } = this.#expectedNonces.get(message.nonce)!;
			if ('evt' in message && message.evt === RPCEvents.Error) {
				reject(new RPCEventError(message.data));
			} else {
				resolve(message.data);
			}

			this.#expectedNonces.delete(message.nonce);
		}
	}

	/**
	 * Authorize
	 *
	 * @param args - authorize args
	 */
	private async authorize(args: RPCAuthorizeArgs, options?: RequestOptions): Promise<string> {
		const { code } = await this.#request(RPCCommands.Authorize, args, options);

		const jsonBody: RESTPostOAuth2AccessTokenURLEncodedData = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			code,
			grant_type: 'authorization_code',
		};

		if (this.options.redirectUri) {
			jsonBody.redirect_uri = this.options.redirectUri;
		}

		const response = (await fetch(`https://discord.com/api${Routes.oauth2TokenExchange()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(jsonBody),
			...options,
		}).then(async (res) => res.json())) as RESTPostOAuth2AccessTokenResult;

		if (!('access_token' in response)) {
			throw new Error(JSON.stringify(response));
		}

		return response.access_token;
	}

	/**
	 * Authenticate
	 *
	 * @param accessToken - access token
	 */
	public async authenticate(accessToken: string, options?: RequestOptions): Promise<this> {
		const { application, user } = await this.#request(RPCCommands.Authenticate, { access_token: accessToken }, options);
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
	public async getGuild(id: Snowflake, timeout: number, options?: RequestOptions): Promise<RPCGetGuildResultData> {
		return this.#request(RPCCommands.GetGuild, { guild_id: id, timeout }, options);
	}

	/**
	 * Fetch all guilds
	 *
	 * @param timeout - Timeout request
	 */
	public async getGuilds(timeout: number, options?: RequestOptions): Promise<RPCGetGuildsResultData> {
		return this.#request(RPCCommands.GetGuilds, { timeout }, options);
	}

	/**
	 * Get a channel
	 *
	 * @param id - Channel id
	 */
	public async getChannel(id: Snowflake, options?: RequestOptions): Promise<RPCGetChannelResultData> {
		return this.#request(RPCCommands.GetChannel, { channel_id: id }, options);
	}

	/**
	 * Get all channels
	 *
	 * @param id - Guild id
	 */
	public async getChannels(id: Snowflake, options?: RequestOptions): Promise<RPCGetChannelsResultData['channels']> {
		const { channels } = await this.#request(RPCCommands.GetChannels, { guild_id: id }, options);
		return channels;
	}

	/**
	 * Create channel invite
	 *
	 * @param id - Channel id
	 */
	public async createChannelInvite(id: Snowflake, options?: RequestOptions): Promise<RPCCreateChannelInviteResultData> {
		return this.#request(RPCCommands.CreateChannelInvite, { channel_id: id }, options);
	}

	/**
	 * Tell discord which devices are certified
	 *
	 * @param devices - Certified devices to send to discord
	 */
	public async setCertifiedDevices(
		devices: RPCCertifiedDevice[],
		options?: RequestOptions,
	): Promise<RPCSetCertifiedDevicesResultData> {
		return this.#request(
			RPCCommands.SetCertifiedDevices,
			{
				devices,
			},
			options,
		);
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
		options?: RequestOptions,
	): Promise<RPCSetUserVoiceSettingsResultData> {
		return this.#request(
			RPCCommands.SetUserVoiceSettings,
			{
				user_id: id,
				...settings,
			},
			options,
		);
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
		options?: RequestOptions,
	): Promise<RPCSelectVoiceChannelResultData> {
		const args: RPCSelectVoiceChannelArgs = { channel_id: id, force };
		if (timeout) {
			args.timeout = timeout;
		}

		return this.#request(RPCCommands.SelectVoiceChannel, args, options);
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
		options?: RequestOptions,
	): Promise<RPCSelectTextChannelResultData> {
		const args: RPCSelectTextChannelArgs = { channel_id: id };
		if (timeout) {
			args.timeout = timeout;
		}

		return this.#request(RPCCommands.SelectTextChannel, args, options);
	}

	/**
	 * Get current voice settings
	 *
	 */
	public async getVoiceSettings(options?: RequestOptions): Promise<RPCGetVoiceSettingsResultData> {
		return this.#request(RPCCommands.GetVoiceSettings, options);
	}

	/**
	 * Set current voice settings, overriding the current settings until this session disconnects.
	 * This also locks the settings for any other rpc sessions which may be connected.
	 *
	 * @param args - Settings
	 */
	public async setVoiceSettings(args: RPCSetVoiceSettingsArgs, options?: RequestOptions): Promise<unknown> {
		return this.#request(RPCCommands.SetVoiceSettings, args, options);
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
		options?: RequestOptions,
	): Promise<unknown> {
		activity.instance = Boolean(activity.instance);

		if (activity.timestamps) {
			if ('start' in activity.timestamps && activity.timestamps.start > 2_147_483_647_000) {
				throw new RangeError('timestamps.start must fit into a unix timestamp');
			}

			if ('end' in activity.timestamps && activity.timestamps.end > 2_147_483_647_000) {
				throw new RangeError('timestamps.end must fit into a unix timestamp');
			}
		}

		return this.#request(
			RPCCommands.SetActivity,
			{
				pid: pid ?? 0,
				activity,
			},
			options,
		);
	}

	/**
	 * Clears the currently set presence, if any. This will hide the "Playing X" message
	 * displayed below the user's name.
	 *
	 * @param pid - The application's process ID. Defaults to the executing process' PID.
	 */
	public async clearActivity(pid: number | null = getPid(), options?: RequestOptions): Promise<unknown> {
		return this.#request(
			RPCCommands.SetActivity,
			{
				pid: pid ?? 0,
			},
			options,
		);
	}

	/**
	 * Invite a user to join the game the RPC user is currently playing
	 *
	 * @param userId - The id of the user to invite
	 */
	public async sendJoinInvite(userId: Snowflake, options?: RequestOptions): Promise<unknown> {
		return this.#request(
			RPCCommands.SendActivityJoinInvite,
			{
				user_id: userId,
			},
			options,
		);
	}

	/**
	 * Reject a join request from a user
	 *
	 * @param userId - The id of the user whose request you wish to reject
	 */
	public async closeJoinRequest(userId: Snowflake, options?: RequestOptions): Promise<unknown> {
		return this.#request(
			RPCCommands.CloseActivityJoinRequest,
			{
				user_id: userId,
			},
			options,
		);
	}

	/**
	 * requires `relationships.read` scope
	 */
	public async getRelationships(options?: RequestOptions) {
		return this.#request(RPCCommands.GetRelationships, options);
	}

	/**
	 * Fetches a user
	 */
	public async getUser(id: Snowflake, options?: RequestOptions) {
		return this.#request(RPCCommands.GetUser, { id }, options);
	}

	/**
	 * Fetches a user's profile picture
	 */
	public async getImage(
		{ id, format, size }: Omit<RPCGetImageArgs, 'type'>,
		options?: RequestOptions,
	): Promise<string> {
		return (await this.#request(RPCCommands.GetImage, { type: 'user', id, format, size }, options)).data_url;
	}

	/**
	 * Subscribe to an event
	 *
	 * @param event - Name of event e.g. `MESSAGE_CREATE`
	 * @param args - Args for event e.g. `{ channel_id: '1234' }`
	 */
	public async subscribe<Evt extends RPCEvents>(
		...[event, args, options]: EventAndArgsParameters<Evt>
	): Promise<{ unsubscribe(): Promise<RPCUnsubscribeResultData> }> {
		await this.#request(RPCCommands.Subscribe, args, options, event);
		return {
			unsubscribe: async () => this.#request(RPCCommands.Unsubscribe, args, options, event),
		};
	}

	/**
	 * Unsubscribe from an event
	 *
	 * @param event - Name of event e.g. `MESSAGE_CREATE`
	 * @param args - Args for event e.g. `{ channel_id: '1234' }`
	 */
	public async unsubscribe<Evt extends RPCEvents>(
		...[event, args, options]: EventAndArgsParameters<Evt>
	): Promise<{ subscribe(): Promise<RPCSubscribeResultData> }> {
		await this.#request(RPCCommands.Subscribe, args, options, event);
		return {
			subscribe: async () => this.#request(RPCCommands.Subscribe, args, options, event),
		};
	}

	/**
	 * Destroy the client
	 */
	public async destroy() {
		await this.transport.close();
	}
}

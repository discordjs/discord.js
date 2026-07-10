import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import { createConnection, Socket } from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';
import type { RPCMessagePayload } from 'discord-api-types/v10';
import type { RequestOptions, RPCClient } from './client.js';

enum OPCodes {
	Handshake,
	Frame,
	Close,
	Ping,
	Pong,
}

interface HandshakePayload {
	client_id: string;
	v: number;
}

async function canOpenFile(path: string): Promise<boolean> {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

async function getIPCPath(id: number) {
	if (process.platform === 'win32') {
		return String.raw`\\?\pipe\discord-ipc-${id}`;
	}

	// Unix: check XDG_RUNTIME_DIR, TMPDIR, TMP, TEMP, then /tmp.
	const prefix = process.env.XDG_RUNTIME_DIR ?? process.env.TMPDIR ?? process.env.TMP ?? process.env.TEMP ?? '/tmp';

	// Flatpak/Snap sandboxes nest the socket under app subdirs.
	const bases = [prefix, path.join(prefix, 'app', 'com.discordapp.Discord'), path.join(prefix, 'snap.discord')];

	for (const base of bases) {
		const candidate = path.join(base, `discord-ipc-${id}`);
		if (await canOpenFile(candidate)) return candidate;
	}

	return path.join(prefix, `discord-ipc-${id}`);
}

async function getIPC(id = 0, { promise, resolve, reject } = Promise.withResolvers<Socket>()): Promise<Socket> {
	const path = await getIPCPath(id);

	const onError = async () => {
		if (id < 10) {
			return getIPC(id + 1, { promise, resolve, reject });
		}

		reject(new Error('Could not connect'));
		return undefined;
	};

	const socket = createConnection(path, () => {
		socket.removeListener('error', onError);

		resolve(socket);
	});

	socket.once('error', onError);

	return promise;
}

export function encode(op: number, data: HandshakePayload | Record<string, never> | RPCMessagePayload | string) {
	const stringifiedData = JSON.stringify(data);
	const length = Buffer.byteLength(stringifiedData);
	const packet = Buffer.allocUnsafe(8 + length);

	packet.writeInt32LE(op, 0);
	packet.writeInt32LE(length, 4);
	packet.write(stringifiedData, 8, length);

	return packet;
}

export class IPCTransport extends AsyncEventEmitter {
	private socket: Socket;

	private working: Buffer[];

	public constructor(public readonly client: RPCClient) {
		super();

		this.socket = new Socket();
		this.working = [];
	}

	public async connect() {
		this.socket = await getIPC();

		const socket = this.socket;

		socket.on('close', this.onClose.bind(this));
		socket.on('error', this.onError.bind(this));

		this.emit('open');

		socket.write(
			encode(OPCodes.Handshake, {
				v: 1,
				client_id: this.client.clientId,
			}),
		);

		// paused for manual read management in this.decode()
		socket.pause();

		socket.on('readable', this.decode.bind(this));

		socket.on('end', () => {
			const packets = Buffer.concat(this.working);
			const op = packets.readInt32LE(0);
			const len = packets.readInt32LE(4);
			const data = JSON.parse(packets.subarray(8, len + 8).toString());
			this.working = [];

			// Pong and Handshake is done from the client
			switch (op) {
				case OPCodes.Ping:
					this.send(data, OPCodes.Pong);
					break;
				case OPCodes.Frame:
					if (!data) {
						return;
					}

					this.emit('message', data);
					break;
				case OPCodes.Close:
					this.emit('close', data);
					break;
				default:
					break;
			}
		});
	}

	private async decode() {
		let packet: Buffer;
		while ((packet = this.socket.read()) !== null) {
			this.working.push(packet);
		}
	}

	public onClose(data: unknown) {
		this.socket.removeAllListeners();
		this.socket = new Socket();
		this.working = [];
		const error = typeof data === 'boolean' ? new Error('socket closed') : data;
		this.emit('close', error);
	}

	public onError(error: unknown) {
		this.emit('error', error);
	}

	public send(data: string, op: OPCodes.Ping): void;
	public send(data: RPCMessagePayload, op?: OPCodes.Frame | OPCodes.Pong): void;
	public send(data: Record<string, never>, op: OPCodes.Close): void;
	public send(data: Record<string, never> | RPCMessagePayload | string, op = OPCodes.Frame) {
		this.socket.write(encode(op, data));
	}

	public async close(options?: RequestOptions) {
		const { promise, resolve, reject } = Promise.withResolvers();
		const signal = options?.signal ?? AbortSignal.timeout(10e3);

		this.once('close', (error) => {
			resolve(error);
		});

		signal.addEventListener('abort', (_: Event, reason?: string) => {
			if (this.listenerCount('close') === 0) return;
			reject(reason);
		});

		this.send({}, OPCodes.Close);
		this.socket.end();

		return promise;
	}

	public ping() {
		this.send(randomUUID(), OPCodes.Ping);
	}
}

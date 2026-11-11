import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
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
	const prefix = process.env.XDG_RUNTIME_DIR ?? process.env.TMPDIR ?? '/tmp';

	// Flatpak/Snap sandboxes nest the socket under app subdirs.
	const bases = [prefix, path.join(prefix, 'app', 'com.discordapp.Discord'), path.join(prefix, 'snap.discord')];

	for (const base of bases) {
		const candidate = path.join(base, `discord-ipc-${id}`);
		if (await canOpenFile(candidate)) return candidate;
	}

	return path.join(prefix, `discord-ipc-${id}`);
}

async function getIPC(id: number, signal: AbortSignal): Promise<Socket> {
	signal.throwIfAborted();
	const path = await getIPCPath(id);
	signal.throwIfAborted();
	const socket = createConnection(path);
	try {
		await once(socket, 'connect', { signal });
		return socket;
	} catch (error) {
		socket.destroy();
		signal.throwIfAborted();
		throw error;
	}
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

interface Working {
	buffer: Buffer;
	len: number;
	op: number;
}

export class IPCTransport extends AsyncEventEmitter {
	private socket: Socket;

	private readonly working: Working;

	private connectionAbort: AbortController | null = null;

	public constructor(public readonly client: RPCClient) {
		super();

		this.socket = new Socket();
		this.working = {
			op: 0,
			len: 0,
			buffer: Buffer.from([]),
		};
	}

	public async connect(options?: RequestOptions) {
		const controller = new AbortController();
		this.connectionAbort = controller;
		const signal = options?.signal ? AbortSignal.any([options.signal, controller.signal]) : controller.signal;
		try {
			for (let id = 0; id < 10; id++) {
				try {
					const socket = await getIPC(id, signal);
					if (signal.aborted) {
						socket.destroy();
						signal.throwIfAborted();
					}
					this.socket = socket;
					break;
				} catch (error: unknown) {
					signal.throwIfAborted();
					if (id === 9) throw error;
				}
			}
			const socket = this.socket;
			socket.on('close', this.onClose.bind(this));
			socket.on('error', this.onError.bind(this));

			this.emit('open');
			if (signal.aborted || this.socket !== socket || socket.destroyed) {
				if (this.socket === socket) this.onClose(false);
				else socket.destroy();
				signal.throwIfAborted();
				throw new Error('IPC connection closed');
			}

			socket.write(
				encode(OPCodes.Handshake, {
					v: 1,
					client_id: this.client.clientId,
				}),
			);

			// paused for manual read management in this.decode()
			socket.pause();

			socket.on('readable', this.decode.bind(this));
		} finally {
			if (this.connectionAbort === controller) this.connectionAbort = null;
		}
	}

	private decode() {
		const socket = this.socket;
		let packet: Buffer;
		const chunks = [];
		while ((packet = socket.read()) !== null) {
			chunks.push(packet);
		}

		if (chunks.length === 0) return;

		this.working.buffer = Buffer.concat([this.working.buffer, ...chunks]);
		while (this.working.buffer.length >= 8 && !socket.destroyed) {
			const op = this.working.buffer.readUInt32LE(0);
			const len = this.working.buffer.readUInt32LE(4);
			if (this.working.buffer.length < len + 8) return;
			const payload = this.working.buffer.subarray(8, len + 8);
			this.working.buffer = this.working.buffer.subarray(len + 8);
			let data;
			try {
				data = JSON.parse(payload.toString());
			} catch {
				socket.destroy();
				return;
			}

			switch (op) {
				case OPCodes.Ping:
					this.send(data, OPCodes.Pong);
					break;
				case OPCodes.Frame:
					if (data) this.emit('message', data);
					break;
				case OPCodes.Close:
					this.onClose(data);
					return;
				default:
					break;
			}
		}
	}

	public onClose(data: unknown) {
		this.socket.removeAllListeners();
		this.socket.destroy();
		this.socket = new Socket();
		this.working.buffer = Buffer.from([]);
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
		this.connectionAbort?.abort(new Error('IPC connection closed'));
		const socket = this.socket;
		if (socket.pending || socket.destroyed) {
			socket.destroy();
			return;
		}
		const { promise, resolve, reject } = Promise.withResolvers();
		const signal = options?.signal ?? AbortSignal.timeout(10e3);

		const onAbort = () => {
			signal.removeEventListener('abort', onAbort);
			this.removeListener('close', onClose);
			this.onClose(false);
			reject(signal.reason instanceof Error ? signal.reason : new Error(String(signal.reason)));
		};

		function onClose(error: unknown) {
			signal.removeEventListener('abort', onAbort);
			resolve(error);
		}

		this.once('close', onClose);
		signal.addEventListener('abort', onAbort, { once: true });
		if (signal.aborted) {
			onAbort();
			return promise;
		}

		this.send({}, OPCodes.Close);
		socket.end();

		return promise;
	}

	/**
	 * Manual ping method
	 */
	public ping() {
		this.send(randomUUID(), OPCodes.Ping);
	}
}

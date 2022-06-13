import { createSocket, Socket } from 'node:dgram';
import { EventEmitter } from 'node:events';
import { isIPv4 } from 'node:net';

/**
 * Stores an IP address and port. Used to store socket details for the local client as well as
 * for Discord.
 */
export interface SocketConfig {
	ip: string;
	port: number;
}

interface KeepAlive {
	value: number;
	timestamp: number;
}

/**
 * Parses the response from Discord to aid with local IP discovery.
 *
 * @param message - The received message
 */
export function parseLocalPacket(message: Buffer): SocketConfig {
	const packet = Buffer.from(message);

	const ip = packet.slice(8, packet.indexOf(0, 8)).toString('utf-8');

	if (!isIPv4(ip)) {
		throw new Error('Malformed IP address');
	}

	const port = packet.readUInt16BE(packet.length - 2);

	return { ip, port };
}

/**
 * The interval in milliseconds at which keep alive datagrams are sent.
 */
const KEEP_ALIVE_INTERVAL = 5e3;

/**
 * The maximum number of keep alive packets which can be missed.
 */
const KEEP_ALIVE_LIMIT = 12;

/**
 * The maximum value of the keep alive counter.
 */
const MAX_COUNTER_VALUE = 2 ** 32 - 1;

/**
 * Manages the UDP networking for a voice connection.
 */
export class VoiceUDPSocket extends EventEmitter {
	/**
	 * The underlying network Socket for the VoiceUDPSocket.
	 */
	private readonly socket: Socket;

	/**
	 * The socket details for Discord (remote)
	 */
	private readonly remote: SocketConfig;

	/**
	 * A list of keep alives that are waiting to be acknowledged.
	 */
	private readonly keepAlives: KeepAlive[];

	/**
	 * The counter used in the keep alive mechanism.
	 */
	private keepAliveCounter = 0;

	/**
	 * The buffer used to write the keep alive counter into.
	 */
	private readonly keepAliveBuffer: Buffer;

	/**
	 * The Node.js interval for the keep-alive mechanism.
	 */
	private readonly keepAliveInterval: NodeJS.Timeout;

	/**
	 * The time taken to receive a response to keep alive messages.
	 */
	public ping?: number;

	/**
	 * The debug logger function, if debugging is enabled.
	 */
	private readonly debug: null | ((message: string) => void);

	/**
	 * Creates a new VoiceUDPSocket.
	 *
	 * @param remote - Details of the remote socket
	 */
	public constructor(remote: SocketConfig, debug = false) {
		super();
		this.socket = createSocket('udp4');
		this.socket.on('error', (error: Error) => this.emit('error', error));
		this.socket.on('message', (buffer: Buffer) => this.onMessage(buffer));
		this.socket.on('close', () => this.emit('close'));
		this.remote = remote;
		this.keepAlives = [];
		this.keepAliveBuffer = Buffer.alloc(8);
		this.keepAliveInterval = setInterval(() => this.keepAlive(), KEEP_ALIVE_INTERVAL);
		setImmediate(() => this.keepAlive());

		this.debug = debug ? (message: string) => this.emit('debug', message) : null;
	}

	/**
	 * Called when a message is received on the UDP socket.
	 *
	 * @param buffer The received buffer
	 */
	private onMessage(buffer: Buffer): void {
		// Handle keep alive message
		if (buffer.length === 8) {
			const counter = buffer.readUInt32LE(0);
			const index = this.keepAlives.findIndex(({ value }) => value === counter);
			if (index === -1) return;
			this.ping = Date.now() - this.keepAlives[index]!.timestamp;
			// Delete all keep alives up to and including the received one
			this.keepAlives.splice(0, index);
		}
		// Propagate the message
		this.emit('message', buffer);
	}

	/**
	 * Called at a regular interval to check whether we are still able to send datagrams to Discord.
	 */
	private keepAlive() {
		if (this.keepAlives.length >= KEEP_ALIVE_LIMIT) {
			this.debug?.('UDP socket has not received enough responses from Discord - closing socket');
			this.destroy();
			return;
		}

		this.keepAliveBuffer.writeUInt32LE(this.keepAliveCounter, 0);
		this.send(this.keepAliveBuffer);
		this.keepAlives.push({
			value: this.keepAliveCounter,
			timestamp: Date.now(),
		});
		this.keepAliveCounter++;
		if (this.keepAliveCounter > MAX_COUNTER_VALUE) {
			this.keepAliveCounter = 0;
		}
	}

	/**
	 * Sends a buffer to Discord.
	 *
	 * @param buffer - The buffer to send
	 */
	public send(buffer: Buffer) {
		return this.socket.send(buffer, this.remote.port, this.remote.ip);
	}

	/**
	 * Closes the socket, the instance will not be able to be reused.
	 */
	public destroy() {
		try {
			this.socket.close();
		} catch {}
		clearInterval(this.keepAliveInterval);
	}

	/**
	 * Performs IP discovery to discover the local address and port to be used for the voice connection.
	 *
	 * @param ssrc - The SSRC received from Discord
	 */
	public performIPDiscovery(ssrc: number): Promise<SocketConfig> {
		return new Promise((resolve, reject) => {
			const listener = (message: Buffer) => {
				try {
					if (message.readUInt16BE(0) !== 2) return;
					const packet = parseLocalPacket(message);
					this.socket.off('message', listener);
					resolve(packet);
				} catch {}
			};

			this.socket.on('message', listener);
			this.socket.once('close', () => reject(new Error('Cannot perform IP discovery - socket closed')));

			const discoveryBuffer = Buffer.alloc(74);

			discoveryBuffer.writeUInt16BE(1, 0);
			discoveryBuffer.writeUInt16BE(70, 2);
			discoveryBuffer.writeUInt32BE(ssrc, 4);
			this.send(discoveryBuffer);
		});
	}
}

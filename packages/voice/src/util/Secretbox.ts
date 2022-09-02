import { Buffer } from 'node:buffer';

interface Methods {
	close(opusPacket: Buffer, nonce: Buffer, secretKey: Uint8Array): Buffer;
	open(buffer: Buffer, nonce: Buffer, secretKey: Uint8Array): Buffer | null;
	random(bytes: number, nonce: Buffer): Buffer;
}

const libs = {
	'sodium-native': (sodium: any): Methods => ({
		open: (buffer: Buffer, nonce: Buffer, secretKey: Uint8Array) => {
			if (buffer) {
				const output = Buffer.allocUnsafe(buffer.length - sodium.crypto_box_MACBYTES);
				if (sodium.crypto_secretbox_open_easy(output, buffer, nonce, secretKey)) return output;
			}

			return null;
		},
		close: (opusPacket: Buffer, nonce: Buffer, secretKey: Uint8Array) => {
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			const output = Buffer.allocUnsafe(opusPacket.length + sodium.crypto_box_MACBYTES);
			sodium.crypto_secretbox_easy(output, opusPacket, nonce, secretKey);
			return output;
		},
		random: (num: number, buffer: Buffer = Buffer.allocUnsafe(num)) => {
			sodium.randombytes_buf(buffer);
			return buffer;
		},
	}),
	sodium: (sodium: any): Methods => ({
		open: sodium.api.crypto_secretbox_open_easy,
		close: sodium.api.crypto_secretbox_easy,
		random: (num: number, buffer: Buffer = Buffer.allocUnsafe(num)) => {
			sodium.api.randombytes_buf(buffer);
			return buffer;
		},
	}),
	'libsodium-wrappers': (sodium: any): Methods => ({
		open: sodium.crypto_secretbox_open_easy,
		close: sodium.crypto_secretbox_easy,
		random: sodium.randombytes_buf,
	}),
	tweetnacl: (tweetnacl: any): Methods => ({
		open: tweetnacl.secretbox.open,
		close: tweetnacl.secretbox,
		random: tweetnacl.randomBytes,
	}),
} as const;

const fallbackError = () => {
	throw new Error(
		`Cannot play audio as no valid encryption package is installed.
- Install sodium, libsodium-wrappers, or tweetnacl.
- Use the generateDependencyReport() function for more information.\n`,
	);
};

const methods: Methods = {
	open: fallbackError,
	close: fallbackError,
	random: fallbackError,
};

void (async () => {
	for (const libName of Object.keys(libs) as (keyof typeof libs)[]) {
		try {
			// eslint-disable-next-line unicorn/no-abusive-eslint-disable, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
			const lib = require(libName);
			if (libName === 'libsodium-wrappers' && lib.ready) await lib.ready;
			Object.assign(methods, libs[libName](lib));
			break;
		} catch {}
	}
})();

export { methods };

interface Methods {
	open: (buffer: Buffer, nonce: Buffer, secretKey: Uint8Array) => Buffer | null;
	close: (opusPacket: Buffer, nonce: Buffer, secretKey: Uint8Array) => Buffer;
	random: (bytes: number, nonce: Buffer) => Buffer;
}

const libs = {
	sodium: (sodium: any): Methods => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		open: sodium.api.crypto_secretbox_open_easy,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		close: sodium.api.crypto_secretbox_easy,
		random: (n: any, buffer?: Buffer) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			if (!buffer) buffer = Buffer.allocUnsafe(n);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			sodium.api.randombytes_buf(buffer);
			return buffer;
		},
	}),
	'libsodium-wrappers': (sodium: any): Methods => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		open: sodium.crypto_secretbox_open_easy,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		close: sodium.crypto_secretbox_easy,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		random: (n: any) => sodium.randombytes_buf(n),
	}),
	tweetnacl: (tweetnacl: any): Methods => ({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		open: tweetnacl.secretbox.open,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		close: tweetnacl.secretbox,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		random: (n: any) => tweetnacl.randomBytes(n),
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
			// eslint-disable-next-line
			const lib = require(libName);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (libName === 'libsodium-wrappers' && lib.ready) await lib.ready;
			Object.assign(methods, libs[libName](lib));
			break;
		} catch {}
	}
})();

export { methods };

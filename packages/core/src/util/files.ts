import type { RawFile } from '@discordjs/rest';
import type { APIInteractionResponseCallbackData } from 'discord-api-types/v10';

export interface DescriptiveRawFile extends RawFile {
	description?: string;
}

/**
 * A utility function to create a form data payload given an array of file buffers
 *
 * @param files - The files to create a form data payload for
 * @param options - The additional options for the form data payload
 */
export function withFiles(files: DescriptiveRawFile[], options: APIInteractionResponseCallbackData) {
	const body = {
		...options,
		attachments: files.map((file, index) => ({
			id: index.toString(),
			description: file.description,
		})),
	};

	const outputFiles = files.map((file, index) => ({
		name: file.name ?? index.toString(),
		data: file.data,
	}));

	return { body, files: outputFiles };
}

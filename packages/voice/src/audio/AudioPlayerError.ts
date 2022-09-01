import type { AudioResource } from './AudioResource';

/**
 * An error emitted by an AudioPlayer. Contains an attached resource to aid with
 * debugging and identifying where the error came from.
 */
export class AudioPlayerError extends Error {
	/**
	 * The resource associated with the audio player at the time the error was thrown.
	 */
	public readonly resource: AudioResource;

	public constructor(error: Error, resource: AudioResource) {
		super(error.message);
		this.resource = resource;
		this.name = error.name;
		this.stack = error.stack!;
	}
}

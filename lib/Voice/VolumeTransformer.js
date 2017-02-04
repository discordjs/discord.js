'use strict';

const Transform = require('stream').Transform;

/**
 * @see https://github.com/reneraab/pcm-volume/blob/master/index.js Inspired by this script
 */
class Volume extends Transform {
	constructor(volume) {
		super();
		this.set(volume);
	}

	get volume() {
		return this._volume === undefined ? 1 : this._volume;
	}

	set volume(value) {
		this._volume = value;
	}

	// Set the volume so that a value of 0.5 is half the perceived volume and
	// 2.0 is double the perceived volume.
	setVolumeLogarithmic(value) {
		this.volume = Math.pow(value, 1.660964);
	}

	// Set the volume to a value specified as decibels.
	setVolumeDecibels(db) {
		this.volume = Math.pow(10, db / 20);
	}

	get multiplier() {
		return this.volume;
	}

	get() {
		return this.volume;
	}

	set(volume) {
		this.volume = volume === undefined ? 1 : volume;
	}

	_transform(buffer, encoding, callback) {
		let out = new Buffer(buffer.length);

		for (let i = 0; i < buffer.length; i += 2) {
			// Check whether the index is actually in range - sometimes it's possible
			// that it skips ahead too far before the end condition of the for can
			// kick in.
			if (i >= buffer.length - 1) {
				break;
			}

			// Read Int16, multiple with multiplier and round down
			//console.log(this.volume, this.multiplier, buffer.readInt16LE(i));
			let uint = Math.floor(this.multiplier * buffer.readInt16LE(i));

			// Ensure value stays within 16bit
			uint = Math.min(32767, uint);
			uint = Math.max(-32767, uint);

			// Write 2 new bytes into other buffer;
			out.writeInt16LE(uint, i);
		}

		this.push(out);
		callback();
	}
}

module.exports = Volume;
//# sourceMappingURL=VolumeTransformer.js.map

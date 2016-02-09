const Transform = require('stream').Transform;

class Volume extends Transform {
	get volume() {
		return this._volume === undefined ? 1 : this._volume;
	}

	set volume(value) {
		this._volume = value;
	}

	get multiplier() {
		return Math.tan(this.volume);
	}

	get() {
		return this.volume;
	}

	set(volume) {
		this.volume = volume;
	}

	_transform(buffer, encoding, callback) {
		let out = new Buffer(buffer.length);

		for (let i = 0; i < buffer.length; i += 2) {
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

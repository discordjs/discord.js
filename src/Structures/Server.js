const Constants = require('../util/Constants');
const DataStore = require('../util/DataStore');
const User = require('./User');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');

class ServerDataStore extends DataStore {
	constructor() {
		super();

		this._members = {};
		this._channels = {};
	}

	get members() {
		return Object.values(this._members);
	}

	get channels() {
		return Object.values(this._channels);
	}
}

class Server {
	constructor(client, data) {
		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	addChannel(data) {
		let channel = this.store.get('channels', 'id', data.id);
		if (channel) {
			return channel;
		}

		let Construct = data.type === 'text' ? TextChannel : VoiceChannel;
		return this.store.add('channels', new Construct(this.client, this, data));
	}

	setup(data) {
		let client = this.client;
		if (data.hasOwnProperty('unavailable')) {
			this.available = !data.unavailable;
		} else {
			if (!this.hasOwnProperty('available')) {
				this.available = true;
			}
		}

		this.name = data.name || this.name;
		this.icon = data.icon || this.icon;
		this.region = data.region || this.region;
		this.afk_timeout = data.afk_timeout || this.afk_timeout;
		this.member_count = data.member_count || this.member_count;
		this.owner_id = data.owner_id || this.owner_id;
		this.id = data.id || this.id;
		this.joined_at = data.joined_at || this.joined_at;
		this.afk_channel_id = data.afk_channel_id || this.afk_channel_id;

		if (!this.store) {
			this.store = new ServerDataStore();
		}

		if (this.available) {
			if (data.members) {
				for (let member of data.members) {
					this.store.add('members', client.store.add('users', new User(this.client, member.user)));
				}
			}

			if (data.channels) {
				for (let channel of data.channels) {
					this.addChannel(channel);
				}
			}
		}
	}

	get owner() {
		return this.client.store.get('users', 'id', this.owner_id);
	}

	get members() {
		return this.store.members;
	}

	get channels() {
		return this.store.channels;
	}
}

module.exports = Server;

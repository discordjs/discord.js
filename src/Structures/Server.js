const Constants = require("../util/Constants");
const DataStore = require("../util/DataStore");
const User = require("./User");

class ServerDataStore extends DataStore{
	constructor() {
		super();
		this._members = [];
		this._channels = [];
	}
	get members() {
		return Object.entries(this._members);
	}
	get channels() {
		return Object.entries(this._channels);
	}
}

class Server{
	constructor(client, data) {
		this.client = client;

		this.available = !data.unavailable;
		this.name = data.name;
		this.icon = data.icon;
		this.region = data.region;
		this.afk_timeout = data.afk_timeout;
		this.member_count = data.member_count;
		this.owner_id = data.owner_id;
		this.id = data.id;
		this.joined_at = data.joined_at;
		this.afk_channel_id = data.afk_channel_id;

		this.store = new ServerDataStore();
		if (this.available) {
			for (let member of data.members) {
				this.store.add("members", client.store.add("users", new User(this.client, member.user)));
			}
		}
	}

	get owner() {
		return this.client.store.get("users", "id", this.owner_id);
	}

	get members() {
		return this.store.members;
	}
	get channels() {
		return this.store.channels;
	}
}

module.exports = Server;
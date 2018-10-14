/// <reference path='index.d.ts' />

import { Collector, Message, CollectorFilter, Client, CollectorHandler, MessageReaction, Collection, User, ReactionCollectorOptions, Snowflake } from 'discord.js';

const client = new Client({
	disableEveryone: false,
	disabledEvents: ['GUILD_MEMBER_ADD']
});

client.on('message', (message) => {
	if (message.content === 'hello') {
		message.channel.sendMessage('o/');
	}

	const collector: ReactionCollector = new ReactionCollector(message,
		(reaction: MessageReaction) => reaction.emoji.toString() === '👌',
		{ time: 30e3 });
	collector.on('end', collected => console.log(collected));
});

client.login('dsfsd754.4fds4f68d4f6sd46f4s.7878easfdsgdfFDSIJIO');

export class TestCollector extends Collector<Snowflake, Message> {
	public filter: CollectorFilter;
	public constructor(client: Client, filter: CollectorFilter) {
		super(client, filter);
	}

	public handle(message: Message): CollectorHandler<Snowflake, Message> {
		return { key: message.id, value: message };
	}

	public cleanup(): void {}
	public postCheck(): null { return null; }
}

class ReactionCollector extends Collector<Snowflake, MessageReaction> {
	public message: Message;
	public users: Collection<Snowflake, User>;
	public total: number;
	public options: ReactionCollectorOptions;
	public constructor(message: Message, filter: CollectorFilter, options?: ReactionCollectorOptions) {
		super(message.client, filter, options || {});
		this.message = message;
		this.users = new Collection<Snowflake, User>();
		this.total = 0;
		this.client.on('messageReactionAdd', this.listener);
	}

	public handle(reaction: MessageReaction): CollectorHandler<Snowflake, MessageReaction> {
		if (reaction.message.id !== this.message.id) { return null; }
		return {
			key: reaction.emoji.id || reaction.emoji.name,
			value: reaction
		};
	}

	public postCheck(reaction: MessageReaction, user: User): string {
		this.users.set(user.id, user);
		if (this.options.max && ++this.total >= this.options.max) { return 'limit'; }
		if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) { return 'emojiLimit'; }
		if (this.options.maxUsers && this.users.size >= this.options.maxUsers) { return 'userLimit'; }
		return null;
	}

	public cleanup(): void {
		this.client.removeListener('messageReactionAdd', this.listener as any);
	}
}

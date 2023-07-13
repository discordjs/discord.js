import type { Meta, StoryObj } from '@storybook/react';
import { DiscordMessage } from './Message.jsx';
import { DiscordMessageEmbed } from './MessageEmbed.jsx';
import { DiscordMessages } from './Messages.jsx';

export default {
	title: 'DiscordMessages',
	component: DiscordMessages,
	tags: ['autodocs'],
} satisfies Meta<typeof DiscordMessages>;

type Story = StoryObj<typeof DiscordMessages>;

export const Default = {
	render: ({ ...args }) => (
		<DiscordMessages {...args}>
			<DiscordMessage
				author={{
					avatar: '/assets/discordjs.png',
					bot: true,
					time: 'Today at 21:00',
					username: 'Guide Bot',
				}}
			>
				A _`DiscordMessage`_ must be within _`DiscordMessages`_.
			</DiscordMessage>
			<DiscordMessage
				author={{
					avatar: '/assets/discordjs.png',
					bot: true,
					time: 'Today at 21:01',
					username: 'Guide Bot',
				}}
				reply={{
					author: {
						avatar: '/assets/discordjs.png',
						bot: true,
						username: 'Guide Bot',
					},
					content: 'A _`DiscordMessage`_ must be within _`DiscordMessages`_.',
				}}
				time="21:02"
			>
				It's much better to see the source code of this page to replicate and learn!
			</DiscordMessage>
			<DiscordMessage
				author={{
					avatar: '/assets/discordjs.png',
					bot: true,
					time: 'Today at 21:02',
					username: 'Guide Bot',
				}}
			>
				This message depicts the use of embeds.
				<>
					<DiscordMessageEmbed
						author={{
							avatar: '/assets/discordjs.png',
							username: 'Guide Bot',
							url: 'https://discord.js.org',
						}}
						footer={{
							content: 'Sometimes, titles just have to be.',
							icon: '/assets/discordjs.png',
							timestamp: 'Today at 21:02',
						}}
						title={{ title: 'An amazing title', url: 'https://discord.js.org' }}
					>
						This is a description. You can put a description here. It must be descriptive!
					</DiscordMessageEmbed>
					<DiscordMessageEmbed
						author={{
							avatar: '/assets/discordjs.png',
							username: 'Guide Bot',
						}}
						footer={{ content: "When one amazing title just wasn't enough." }}
						thumbnail={{ alt: 'discord.js logo', image: '/assets/discordjs.png' }}
						title={{ title: 'Another amazing title' }}
					>
						Multiple embeds!
					</DiscordMessageEmbed>
					<DiscordMessageEmbed
						author={{
							avatar: '/assets/discordjs.png',
							username: 'Guide Bot',
						}}
						fields={[
							{
								name: 'First field',
								value: 'Some value',
							},
							{
								name: 'Another field',
								value: 'Another value',
								inline: true,
							},
							{
								name: 'A third field',
								value: 'That is inline',
								inline: true,
							},
							{
								name: 'At last',
								value: 'This is the last field',
								inline: true,
							},
						]}
						footer={{ timestamp: 'Today at 21:02' }}
						image={{
							alt: 'discord.js logo',
							url: '/assets/discordjs.png',
							width: 300,
							height: 300,
						}}
						thumbnail={{ alt: 'discord.js logo', image: '/assets/discordjs.png' }}
						title={{ title: 'Fields are also supported!' }}
					/>
				</>
			</DiscordMessage>
			<DiscordMessage
				author={{
					avatar: '/assets/discordjs.png',
					bot: true,
					time: 'Today at 21:03',
					username: 'Guide Bot',
				}}
				interaction={{
					author: {
						avatar: '/assets/discordjs.png',
						bot: true,
						username: 'Guide Bot',
					},
					command: '/interaction',
				}}
			>
				Interactions are supported! I definitely used a command.
			</DiscordMessage>
			<DiscordMessage
				author={{
					avatar: '/assets/discordjs.png',
					bot: true,
					verified: true,
					color: 'text-red-500',
					time: 'Today at 21:04',
					username: 'Guide Bot',
				}}
				reply={{
					author: {
						avatar: '/assets/snek-bot.jpeg',
						bot: true,
						verified: true,
						color: 'text-blue-500',
						username: 'Snek Bot',
					},
					content: 'You can also have verified bots, like me!',
				}}
			>
				Display colors are supported as well!
			</DiscordMessage>
		</DiscordMessages>
	),
	args: {
		rounded: false,
	},
} satisfies Story;

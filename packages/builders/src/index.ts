export * as EmbedAssertions from './messages/embed/Assertions.js';
export * from './messages/embed/Embed.js';
export * from './messages/formatters.js';

export * as ComponentAssertions from './components/Assertions.js';
export * from './components/ActionRow.js';
export * from './components/button/Button.js';
export * from './components/Component.js';
export * from './components/Components.js';
export * from './components/textInput/TextInput.js';
export * as TextInputAssertions from './components/textInput/Assertions.js';
export * from './interactions/modals/Modal.js';
export * as ModalAssertions from './interactions/modals/Assertions.js';

export * from './components/selectMenu/BaseSelectMenu.js';
export * from './components/selectMenu/ChannelSelectMenu.js';
export * from './components/selectMenu/MentionableSelectMenu.js';
export * from './components/selectMenu/RoleSelectMenu.js';
export * from './components/selectMenu/SelectMenu.js';
export * from './components/selectMenu/SelectMenuOption.js';
export * from './components/selectMenu/StringSelectMenuOption.js';
export * from './components/selectMenu/StringSelectMenu.js';
export * from './components/selectMenu/UserSelectMenu.js';

export * as SlashCommandAssertions from './interactions/slashCommands/Assertions.js';
export * from './interactions/slashCommands/SlashCommandBuilder.js';
export * from './interactions/slashCommands/SlashCommandSubcommands.js';
export * from './interactions/slashCommands/options/boolean.js';
export * from './interactions/slashCommands/options/channel.js';
export * from './interactions/slashCommands/options/integer.js';
export * from './interactions/slashCommands/options/mentionable.js';
export * from './interactions/slashCommands/options/number.js';
export * from './interactions/slashCommands/options/role.js';
export * from './interactions/slashCommands/options/attachment.js';
export * from './interactions/slashCommands/options/string.js';
export * from './interactions/slashCommands/options/user.js';
export * from './interactions/slashCommands/mixins/ApplicationCommandNumericOptionMinMaxValueMixin.js';
export * from './interactions/slashCommands/mixins/ApplicationCommandOptionBase.js';
export * from './interactions/slashCommands/mixins/ApplicationCommandOptionChannelTypesMixin.js';
export * from './interactions/slashCommands/mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.js';
export * from './interactions/slashCommands/mixins/NameAndDescription.js';
export * from './interactions/slashCommands/mixins/SharedSlashCommandOptions.js';

export * as ContextMenuCommandAssertions from './interactions/contextMenuCommands/Assertions.js';
export * from './interactions/contextMenuCommands/ContextMenuCommandBuilder.js';

export * from './util/componentUtil.js';
export * from './util/normalizeArray.js';
export * from './util/validation.js';
export * from '@discordjs/util';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/builders/#readme | @discordjs/builders} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{{inject}}[/VI]';

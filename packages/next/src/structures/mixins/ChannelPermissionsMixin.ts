import type { ChannelType, GuildChannelType, ThreadChannelType } from '@discordjs/core';
import { ChannelPermissionMixin as StructurePermissionMixin } from '@discordjs/structures';

export class ChannelPermissionsMixin<
	Type extends Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType> = Exclude<
		GuildChannelType,
		ChannelType.GuildDirectory | ThreadChannelType
	>,
> extends StructurePermissionMixin<Type> {
	// public permissionsFor(userOrRole: RoleResolvable | UserResolvable) {
	// 	return new PermissionsBitField();
	// }
}

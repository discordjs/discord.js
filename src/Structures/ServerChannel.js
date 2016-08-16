"use strict";

import Channel from "./Channel";
import Cache from "../Util/Cache";
import PermissionOverwrite from "./PermissionOverwrite";
import ChannelPermissions from "./ChannelPermissions";
import {reg} from "../Util/ArgumentRegulariser";

export default class ServerChannel extends Channel{
	constructor(data, client, server){
		super(data, client);
		this.name = data.name;
		this.type = data.type;
		this.position = data.position;
		this.permissionOverwrites = data.permissionOverwrites || new Cache();
		this.server = server;
		if (!data.permissionOverwrites) {
			data.permission_overwrites.forEach((permission) => {
				this.permissionOverwrites.add( new PermissionOverwrite(permission) );
			});
		}
	}

	toObject() {
		let keys = ['id', 'name', 'type', 'position'],
			obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		obj.permissionOverwrites = this.permissionOverwrites.map(p => p.toObject());

		return obj;
	}

	permissionsOf(userOrRole){
		userOrRole = this.client.internal.resolver.resolveUser(userOrRole);
		if (userOrRole) {
			if (this.server.ownerID === userOrRole.id) {
				return new ChannelPermissions(4294967295);
			}
			var everyoneRole = this.server.roles.get("id", this.server.id);

			var userRoles = [everyoneRole].concat(this.server.rolesOf(userOrRole) || []);
			var userRolesID = userRoles.filter((v) => !!v).map((v) => v.id);
			var roleOverwrites = [], memberOverwrites = [];

			this.permissionOverwrites.forEach((overwrite) => {
				if (overwrite.type === "member" && overwrite.id === userOrRole.id) {
					memberOverwrites.push(overwrite);
				} else if (overwrite.type === "role" && ~userRolesID.indexOf(overwrite.id)) {
					roleOverwrites.push(overwrite);
				}
			});

			var permissions = 0;

			for(var serverRole of userRoles){
				if (serverRole) {
					permissions |= serverRole.permissions;
				}
			}

			for(var overwrite of roleOverwrites.concat(memberOverwrites)){
				if (overwrite) {
					permissions = permissions & ~overwrite.deny;
					permissions = permissions | overwrite.allow;
				}
			}

			return new ChannelPermissions(permissions);

		} else {
			userOrRole = this.client.internal.resolver.resolveRole(userOrRole);
			if (userOrRole) {
				var permissions = this.server.roles.get("id", this.server.id).permissions | userOrRole.permissions;
				var overwrite = this.permissionOverwrites.get("id", this.server.id);
				permissions = (permissions & ~overwrite.deny) | overwrite.allow;
				overwrite = this.permissionOverwrites.get("id", userOrRole.id);
				if (overwrite) {
					permissions = (permissions & ~overwrite.deny) | overwrite.allow;
				}
				return new ChannelPermissions(permissions);
			} else {
				return null;
			}
		}
	}

	permsOf(user){
		return this.permissionsOf(user);
	}

	mention(){
		return `<#${this.id}>`;
	}

	toString(){
		return this.mention();
	}

	setName(){
		return this.client.setChannelName.apply(this.client, reg(this, arguments));
	}

	setPosition(){
		return this.client.setChannelPosition.apply(this.client, reg(this, arguments));
	}

	update(){
		return this.client.updateChannel.apply(this.client, reg(this, arguments));
	}
}

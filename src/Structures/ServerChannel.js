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
		this.permissionOverwrites = new Cache();
		this.server = server;
		data.permission_overwrites.forEach((permission) => {
			this.permissionOverwrites.add( new PermissionOverwrite(permission) );
		});
	}

	permissionsOf(user){
		user = this.client.internal.resolver.resolveUser(user);
		if(user){
			if(this.server.owner.equals(user)){
				return new ChannelPermissions(4294967295);
			}
			var everyoneRole = this.server.roles.get("name", "@everyone");

			var userRoles = [everyoneRole].concat(this.server.rolesOf(user) || []);
			var userRolesID = userRoles.map((v) => v.id);
			var roleOverwrites = [], memberOverwrites = [];

			this.permissionOverwrites.forEach((overwrite) => {
				if(overwrite.type === "member" && overwrite.id === user.id){
					memberOverwrites.push(overwrite);
				}else if(overwrite.type === "role" && overwrite.id in userRolesID){
					roleOverwrites.push(overwrite);
				}
			});

			var permissions = 0;

			for(var serverRole of userRoles){
				permissions |= serverRole.permissions;
			}

			for(var overwrite of roleOverwrites.concat(memberOverwrites)){
				permissions = permissions & ~overwrite.deny;
				permissions = permissions | overwrite.allow;
			}

			return new ChannelPermissions(permissions);

		}else{
			return null;
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
}

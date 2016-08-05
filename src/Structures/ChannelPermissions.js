"use strict";

import {Permissions} from "../Constants";

export default class ChannelPermissions {
	constructor(permissions){
		this.permissions = permissions;
	}

	serialise(explicit){

		var hp = (perm) => this.hasPermission(perm, explicit);

		var json = {};

		for(var permission in Permissions) {
			json[permission] = hp( Permissions[permission] );
		}

		return json;
	}

	serialize(){
		// ;n;
		return this.serialise();
	}

	hasPermission(perm, explicit=false){
		if( perm instanceof String || typeof perm === "string" ){
			perm = Permissions[perm];
		}
		if(!perm){
			return false;
		}
		if(!explicit){ // implicit permissions allowed
			if( !!(this.permissions & Permissions.manageRoles) ){
				// manageRoles allowed, they have all permissions
				return true;
			}
		}
		return !!(this.permissions & perm);
	}
}

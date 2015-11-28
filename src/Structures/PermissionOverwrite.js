"use strict";

import {Permissions} from "../Constants";

export default class PermissionOverwrite {

	constructor(data) {
		this.id = data.id;
		this.type = data.type; // member or role
		this.deny = data.deny;
		this.allow = data.allow;
	}

	// returns an array of allowed permissions
	get allowed(){
		var allowed = [];
		for( var permName in Permissions ){
			if(permName === "manageRoles" || permName === "manageChannels"){
				// these permissions do not exist in overwrites.
				continue;
			}

			if(!!(this.allow & Permissions[permName])){
				allowed.push(permName);
			}
		}
		return allowed;
	}

	// returns an array of denied permissions
	get denied(){
		var denied = [];
		for( var permName in Permissions ){
			if(permName === "manageRoles" || permName === "manageChannels"){
				// these permissions do not exist in overwrites.
				continue;
			}

			if(!!(this.deny & Permissions[permName])){
				denied.push(permName);
			}
		}
		return denied;
	}

	setAllowed(allowedArray){
		allowedArray.forEach( (permission) => {
			if(permission instanceof String || typeof permission === "string"){
				permission = Permissions[permission];
			}
			if(permission){
				this.allow |= (1 << permission);
			}
		} );
	}

	setDenied(deniedArray){
		deniedArray.forEach( (permission) => {
			if(permission instanceof String || typeof permission === "string"){
				permission = Permissions[permission];
			}
			if(permission){
				this.deny |= (1 << permission);
			}
		} );
	}
}

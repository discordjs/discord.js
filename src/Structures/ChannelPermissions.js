"use strict";

import {Permissions} from "../Constants";

export default class ChannelPermissions {
	constructor(permissions){
		this.permissions = permissions;
	}

	serialise(explicit){

		var hp = (perm) => this.hasPermission(perm, explicit);

		return {
			// general
			createInstantInvite : hp( Permissions.createInstantInvite ),
			kickMembers : hp( Permissions.kickMembers ),
			banMembers : hp( Permissions.banMembers ),
			managePermissions : hp ( Permissions.managePermissions ),
			manageChannel : hp( Permissions.manageChannel ),
			manageServer : hp( Permissions.manageServer ),
			// text
			readMessages : hp( Permissions.readMessages ),
			sendMessages : hp( Permissions.sendMessages ),
			sendTTSMessages : hp( Permissions.sendTTSMessages ),
			manageMessages : hp( Permissions.manageMessages ),
			embedLinks : hp( Permissions.embedLinks ),
			attachFiles : hp( Permissions.attachFiles ),
			readMessageHistory : hp( Permissions.readMessageHistory ),
			mentionEveryone : hp( Permissions.mentionEveryone ),
			// voice
			voiceConnect : hp( Permissions.voiceConnect ),
			voiceSpeak : hp( Permissions.voiceSpeak ),
			voiceMuteMembers : hp( Permissions.voiceMuteMembers ),
			voiceDeafenMembers : hp( Permissions.voiceDeafenMembers ),
			voiceMoveMembers : hp( Permissions.voiceMoveMembers ),
			voiceUseVAD : hp( Permissions.voiceUseVAD )
		};
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

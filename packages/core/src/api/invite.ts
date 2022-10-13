import type { REST } from '@discordjs/rest';
import { Routes, type APIInvite } from 'discord-api-types/v10';

export class InvitesAPI {
	private readonly rest: REST;

	public constructor(rest: REST) {
		this.rest = rest;
	}

	/**
	 * Fetches an invite
	 *
	 * @param code - The invite code
	 */
	public async get(code: string) {
		return (await this.rest.get(Routes.invite(code))) as APIInvite;
	}

	/**
	 * Deletes an invite
	 *
	 * @param code - The invite code
	 * @param reason - The reason for deleting the invite
	 */
	public async delete(code: string, reason?: string) {
		await this.rest.delete(Routes.invite(code), { reason });
	}
}

/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIApplicationRoleConnectionMetadataResult,
	type RESTPutAPIApplicationRoleConnectionMetadataResult,
	type RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
	type Snowflake,
} from 'discord-api-types/v10';

export class RoleConnectionsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Gets the role connection metadata records for the application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records}
	 * @param applicationId - The id of the application to get role connection metadata records for
	 * @param options - The options to use when fetching the role connection metadata records
	 */
	public async getMetadataRecords(applicationId: Snowflake, { signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.applicationRoleConnectionMetadata(applicationId), {
			signal,
		}) as Promise<RESTGetAPIApplicationRoleConnectionMetadataResult>;
	}

	/**
	 * Updates the role connection metadata records for the application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records}
	 * @param applicationId - The id of the application to update role connection metadata records for
	 * @param body - The new role connection metadata records
	 * @param options - The options to use when updating the role connection metadata records
	 */
	public async updateMetadataRecords(
		applicationId: Snowflake,
		body: RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.put(Routes.applicationRoleConnectionMetadata(applicationId), {
			body,
			signal,
		}) as Promise<RESTPutAPIApplicationRoleConnectionMetadataResult>;
	}
}

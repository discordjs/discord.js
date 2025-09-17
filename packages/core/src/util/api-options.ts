import type { RequestData } from '@discordjs/rest';
import type { If, IsNever, RequiredKeysOf } from 'type-fest';

/**
 * Creates the input type for an API method with optional properties based on the provided type parameters.
 *
 * @typeParam Options - Options for the request.
 * @typeParam Route - Route parameters for the endpoint.
 * @typeParam Body - Body for the request.
 * @typeParam Query - Query parameters for the endpoint.
 */
export type APIOptions<
	Options extends RequestData,
	Route extends object = never,
	Body extends object = never,
	Query extends object = never,
> = If<IsNever<Body>, object, If<IsNever<RequiredKeysOf<Body>>, { body?: Body }, { body: Body }>> &
	If<IsNever<Query>, object, If<IsNever<RequiredKeysOf<Query>>, { query?: Query }, { query: Query }>> &
	If<IsNever<Route>, object, { route: Route }> & { options?: Options };

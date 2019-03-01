/*
 * Copyright (c) 2018 amy, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.mewna.catnip.rest;

import io.vertx.core.http.HttpMethod;
import lombok.Getter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static io.vertx.core.http.HttpMethod.*;

/**
 * @author amy
 * @since 8/31/18.
 */
@SuppressWarnings({"StaticVariableOfConcreteClass", "WeakerAccess"})
public final class Routes {
    // @formatter:off
    public static final Route GET_GATEWAY_BOT                     = new Route(GET,    "/gateway/bot");
    public static final Route DELETE_CHANNEL                      = new Route(DELETE, "/channels/{channel.id}", "channel.id");
    public static final Route GET_CHANNEL                         = new Route(GET,    "/channels/{channel.id}", "channel.id");
    public static final Route MODIFY_CHANNEL                      = new Route(PATCH,  "/channels/{channel.id}", "channel.id");
    public static final Route GET_CHANNEL_INVITES                 = new Route(GET,    "/channels/{channel.id}/invites", "channel.id");
    public static final Route CREATE_CHANNEL_INVITE               = new Route(POST,   "/channels/{channel.id}/invites", "channel.id");
    public static final Route GET_CHANNEL_MESSAGES                = new Route(GET,    "/channels/{channel.id}/messages", "channel.id");
    public static final Route CREATE_MESSAGE                      = new Route(POST,   "/channels/{channel.id}/messages", "channel.id");
    public static final Route BULK_DELETE_MESSAGES                = new Route(POST,   "/channels/{channel.id}/messages/bulk-delete", "channel.id");
    public static final Route DELETE_MESSAGE                      = new Route(DELETE, "/channels/{channel.id}/messages/{message.id}", "channel.id");
    public static final Route GET_CHANNEL_MESSAGE                 = new Route(GET,    "/channels/{channel.id}/messages/{message.id}", "channel.id");
    public static final Route EDIT_MESSAGE                        = new Route(PATCH,  "/channels/{channel.id}/messages/{message.id}", "channel.id");
    public static final Route DELETE_ALL_REACTIONS                = new Route(DELETE, "/channels/{channel.id}/messages/{message.id}/reactions", "channel.id");
    public static final Route GET_REACTIONS                       = new Route(GET,    "/channels/{channel.id}/messages/{message.id}/reactions/{emojis}", "channel.id");
    public static final Route DELETE_OWN_REACTION                 = new Route(DELETE, "/channels/{channel.id}/messages/{message.id}/reactions/{emojis}/@me", "channel.id");
    public static final Route CREATE_REACTION                     = new Route(PUT,    "/channels/{channel.id}/messages/{message.id}/reactions/{emojis}/@me", "channel.id");
    public static final Route DELETE_USER_REACTION                = new Route(DELETE, "/channels/{channel.id}/messages/{message.id}/reactions/{emojis}/{user.id}", "channel.id");
    public static final Route DELETE_CHANNEL_PERMISSION           = new Route(DELETE, "/channels/{channel.id}/permissions/{overwrite.id}", "channel.id");
    public static final Route EDIT_CHANNEL_PERMISSIONS            = new Route(PUT,    "/channels/{channel.id}/permissions/{overwrite.id}", "channel.id");
    public static final Route GET_PINNED_MESSAGES                 = new Route(GET,    "/channels/{channel.id}/pins", "channel.id");
    public static final Route DELETE_PINNED_CHANNEL_MESSAGE       = new Route(DELETE, "/channels/{channel.id}/pins/{message.id}", "channel.id");
    public static final Route ADD_PINNED_CHANNEL_MESSAGE          = new Route(PUT,    "/channels/{channel.id}/pins/{message.id}", "channel.id");
    public static final Route TRIGGER_TYPING_INDICATOR            = new Route(POST,   "/channels/{channel.id}/typing", "channel.id");
    public static final Route GET_CHANNEL_WEBHOOKS                = new Route(GET,    "/channels/{channel.id}/webhooks", "channel.id");
    public static final Route CREATE_WEBHOOK                      = new Route(POST,   "/channels/{channel.id}/webhooks", "channel.id");
    public static final Route CREATE_GUILD                        = new Route(POST,   "/guilds");
    public static final Route DELETE_GUILD                        = new Route(DELETE, "/guilds/{guild.id}", "guild.id");
    public static final Route GET_GUILD                           = new Route(GET,    "/guilds/{guild.id}", "guild.id");
    public static final Route MODIFY_GUILD                        = new Route(PATCH,  "/guilds/{guild.id}", "guild.id");
    public static final Route GET_GUILD_AUDIT_LOG                 = new Route(GET,    "/guilds/{guild.id}/audit-logs", "guild.id");
    public static final Route GET_GUILD_BANS                      = new Route(GET,    "/guilds/{guild.id}/bans", "guild.id");
    public static final Route GET_GUILD_BAN                       = new Route(GET,    "/guilds/{guild.id}/bans/{user.id}", "guild.id");
    public static final Route REMOVE_GUILD_BAN                    = new Route(DELETE, "/guilds/{guild.id}/bans/{user.id}", "guild.id");
    public static final Route CREATE_GUILD_BAN                    = new Route(PUT,    "/guilds/{guild.id}/bans/{user.id}", "guild.id");
    public static final Route GET_GUILD_CHANNELS                  = new Route(GET,    "/guilds/{guild.id}/channels", "guild.id");
    public static final Route MODIFY_GUILD_CHANNEL_POSITIONS      = new Route(PATCH,  "/guilds/{guild.id}/channels", "guild.id");
    public static final Route CREATE_GUILD_CHANNEL                = new Route(POST,   "/guilds/{guild.id}/channels", "guild.id");
    public static final Route GET_GUILD_EMBED                     = new Route(GET,    "/guilds/{guild.id}/embed", "guild.id");
    public static final Route MODIFY_GUILD_EMBED                  = new Route(PATCH,  "/guilds/{guild.id}/embed", "guild.id");
    public static final Route LIST_GUILD_EMOJIS                   = new Route(GET,    "/guilds/{guild.id}/emojis", "guild.id");
    public static final Route GET_GUILD_EMOJI                     = new Route(GET,    "/guilds/{guild.id}/emojis/{emojis.id}", "guild.id");
    public static final Route CREATE_GUILD_EMOJI                  = new Route(POST,   "/guilds/{guild.id}/emojis", "guild.id");
    public static final Route MODIFY_GUILD_EMOJI                  = new Route(PATCH,  "/guilds/{guild.id}/emojis/{emojis.id}", "guild.id");
    public static final Route DELETE_GUILD_EMOJI                  = new Route(DELETE, "/guilds/{guild.id}/emojis/{emojis.id}", "guild.id");
    public static final Route GET_GUILD_INTEGRATIONS              = new Route(GET,    "/guilds/{guild.id}/integrations", "guild.id");
    public static final Route CREATE_GUILD_INTEGRATION            = new Route(POST,   "/guilds/{guild.id}/integrations", "guild.id");
    public static final Route DELETE_GUILD_INTEGRATION            = new Route(DELETE, "/guilds/{guild.id}/integrations/{integration.id}", "guild.id");
    public static final Route MODIFY_GUILD_INTEGRATION            = new Route(PATCH,  "/guilds/{guild.id}/integrations/{integration.id}", "guild.id");
    public static final Route SYNC_GUILD_INTEGRATION              = new Route(POST,   "/guilds/{guild.id}/integrations/{integration.id}/sync", "guild.id");
    public static final Route GET_GUILD_INVITES                   = new Route(GET,    "/guilds/{guild.id}/invites", "guild.id");
    public static final Route LIST_GUILD_MEMBERS                  = new Route(GET,    "/guilds/{guild.id}/members", "guild.id");
    public static final Route MODIFY_CURRENT_USERS_NICK           = new Route(PATCH,  "/guilds/{guild.id}/members/@me/nick", "guild.id");
    public static final Route REMOVE_GUILD_MEMBER                 = new Route(DELETE, "/guilds/{guild.id}/members/{user.id}", "guild.id");
    public static final Route GET_GUILD_MEMBER                    = new Route(GET,    "/guilds/{guild.id}/members/{user.id}", "guild.id");
    public static final Route MODIFY_GUILD_MEMBER                 = new Route(PATCH,  "/guilds/{guild.id}/members/{user.id}", "guild.id");
    public static final Route ADD_GUILD_MEMBER                    = new Route(PUT,    "/guilds/{guild.id}/members/{user.id}", "guild.id");
    public static final Route REMOVE_GUILD_MEMBER_ROLE            = new Route(DELETE, "/guilds/{guild.id}/members/{user.id}/roles/{role.id}", "guild.id");
    public static final Route ADD_GUILD_MEMBER_ROLE               = new Route(PUT,    "/guilds/{guild.id}/members/{user.id}/roles/{role.id}", "guild.id");
    public static final Route GET_GUILD_PRUNE_COUNT               = new Route(GET,    "/guilds/{guild.id}/prune", "guild.id");
    public static final Route BEGIN_GUILD_PRUNE                   = new Route(POST,   "/guilds/{guild.id}/prune", "guild.id");
    public static final Route GET_GUILD_VOICE_REGIONS             = new Route(GET,    "/guilds/{guild.id}/regions", "guild.id");
    public static final Route GET_GUILD_ROLES                     = new Route(GET,    "/guilds/{guild.id}/roles", "guild.id");
    public static final Route MODIFY_GUILD_ROLE_POSITIONS         = new Route(PATCH,  "/guilds/{guild.id}/roles", "guild.id");
    public static final Route CREATE_GUILD_ROLE                   = new Route(POST,   "/guilds/{guild.id}/roles", "guild.id");
    public static final Route DELETE_GUILD_ROLE                   = new Route(DELETE, "/guilds/{guild.id}/roles/{role.id}", "guild.id");
    public static final Route MODIFY_GUILD_ROLE                   = new Route(PATCH,  "/guilds/{guild.id}/roles/{role.id}", "guild.id");
    public static final Route GET_GUILD_WEBHOOKS                  = new Route(GET,    "/guilds/{guild.id}/webhooks", "guild.id");
    public static final Route GET_WEBHOOK                         = new Route(GET,    "/webhooks/{webhook.id}", "webhook.id");
    public static final Route MODIFY_WEBHOOK                      = new Route(PATCH,  "/webhooks/{webhook.id}", "webhook.id");
    public static final Route DELETE_WEBHOOK                      = new Route(DELETE, "/webhooks/{webhook.id}", "webhook.id");
    public static final Route GET_WEBHOOK_TOKEN                   = new Route(GET,    "/webhooks/{webhook.id}/{webhook.token}", "webhook.id");
    public static final Route EXECUTE_WEBHOOK                     = new Route(POST,   "/webhooks/{webhook.id}/{webhook.token}", "webhook.id");
    public static final Route DELETE_INVITE                       = new Route(DELETE, "/invites/{invite.code}");
    public static final Route GET_INVITE                          = new Route(GET,    "/invites/{invite.code}");
    public static final Route ACCEPT_INVITE                       = new Route(POST,   "/invites/{invite.code}");
    public static final Route GET_CURRENT_USER                    = new Route(GET,    "/users/@me");
    public static final Route MODIFY_CURRENT_USER                 = new Route(PATCH,  "/users/@me");
    public static final Route GET_USER_DMS                        = new Route(GET,    "/users/@me/channels");
    public static final Route CREATE_DM                           = new Route(POST,   "/users/@me/channels");
    public static final Route GET_CURRENT_USER_GUILDS             = new Route(GET,    "/users/@me/guilds");
    public static final Route LEAVE_GUILD                         = new Route(DELETE, "/users/@me/guilds/{guild.id}");
    public static final Route GET_USER                            = new Route(GET,    "/users/{user.id}");
    public static final Route GET_CURRENT_APPLICATION_INFORMATION = new Route(GET,    "/oauth2/applications/@me");
    public static final Route LIST_VOICE_REGIONS                  = new Route(GET,    "/voice/regions");

    private Routes() {
    }

    @Accessors(fluent = true)
    @SuppressWarnings({"WeakerAccess", "unused"})
    public static final class Route {
        @Getter
        private HttpMethod method;
        @Getter
        private String baseRoute;
        @Getter
        private String majorParam;
        @Getter
        private String ratelimitKey;
        
        public Route() {
        }
        
        public Route(@Nonnull final HttpMethod method, @Nonnull final String baseRoute) {
            this(method, baseRoute, null);
        }
    
        public Route(@Nonnull final HttpMethod method, @Nonnull final String baseRoute, @Nullable final String majorParam) {
            this(method, baseRoute, majorParam, baseRoute);
        }
    
        public Route(@Nonnull final HttpMethod method, @Nonnull final String baseRoute, @Nullable final String majorParam, @Nonnull final String ratelimitKey) {
            this.method = method;
            this.baseRoute = baseRoute;
            this.majorParam = majorParam;
            this.ratelimitKey = ratelimitKey;
        }
        
        @Nonnull
        @CheckReturnValue
        @SuppressWarnings("TypeMayBeWeakened")
        public Route withMajorParam(@Nonnull final String value) {
            if(majorParam == null) {
                throw new IllegalStateException("This route takes no major params!");
            }
            final String majorParamString = '{' + majorParam + '}';
            return new Route(method, baseRoute.replace(majorParamString, value), null,
                    baseRoute.replace(majorParamString, value));
        }
        
        @Nonnull
        @CheckReturnValue
        @SuppressWarnings("TypeMayBeWeakened")
        public Route compile(@Nonnull final String param, @Nonnull final String value) {
            if(param.equalsIgnoreCase(majorParam)) {
                return this;
            }
            return new Route(method, baseRoute.replace('{' + param + '}', value), majorParam, ratelimitKey);
        }
        
        @Nonnull
        @CheckReturnValue
        public Route copy() {
            return new Route(method, baseRoute, majorParam, ratelimitKey);
        }
        
        public Route withQueryString(final String qs) {
            return new Route(method, baseRoute + qs, majorParam, ratelimitKey);
        }
    
        @Override
        public int hashCode() {
            return baseRoute.hashCode();
        }
    
        @Override
        public boolean equals(final Object o) {
            if(!(o instanceof Route)) {
                return false;
            }
            return baseRoute.equalsIgnoreCase(((Route) o).baseRoute);
        }
    
        @Override
        public String toString() {
            return method + " " + baseRoute;
        }
    }
    // @formatter:on
}

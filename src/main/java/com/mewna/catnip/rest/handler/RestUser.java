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

package com.mewna.catnip.rest.handler;

import com.google.common.collect.ImmutableMap;
import com.mewna.catnip.entity.channel.DMChannel;
import com.mewna.catnip.entity.guild.PartialGuild;
import com.mewna.catnip.entity.misc.ApplicationInfo;
import com.mewna.catnip.entity.misc.GatewayInfo;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.internal.CatnipImpl;
import com.mewna.catnip.rest.ResponsePayload;
import com.mewna.catnip.rest.Routes;
import com.mewna.catnip.rest.requester.Requester.OutboundRequest;
import com.mewna.catnip.util.QueryStringBuilder;
import com.mewna.catnip.util.Utils;
import com.mewna.catnip.util.pagination.GuildPaginator;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.net.URI;
import java.util.List;
import java.util.concurrent.CompletionStage;

import static com.mewna.catnip.util.JsonUtil.mapObjectContents;

/**
 * @author amy
 * @since 9/3/18.
 */
@SuppressWarnings({"unused", "WeakerAccess"})
public class RestUser extends RestHandler {
    public RestUser(final CatnipImpl catnip) {
        super(catnip);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<User> getCurrentUser() {
        return getCurrentUserRaw().thenApply(entityBuilder()::createUser);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getCurrentUserRaw() {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_CURRENT_USER,
                ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<User> getUser(@Nonnull final String userId) {
        return getUserRaw(userId).thenApply(entityBuilder()::createUser);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getUserRaw(@Nonnull final String userId) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_USER,
                ImmutableMap.of("user.id", userId)))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    public CompletionStage<User> modifyCurrentUser(@Nullable final String username, @Nullable final URI avatarData) {
        return modifyCurrentUserRaw(username, avatarData).thenApply(entityBuilder()::createUser);
    }
    
    @Nonnull
    public CompletionStage<JsonObject> modifyCurrentUserRaw(@Nullable final String username, @Nullable final URI avatarData) {
        final JsonObject body = new JsonObject();
        if(avatarData != null) {
            Utils.validateImageUri(avatarData);
            body.put("avatar", avatarData.toString());
        }
        body.put("username", username);
        
        return catnip().requester().queue(new OutboundRequest(Routes.MODIFY_CURRENT_USER,
                ImmutableMap.of(), body))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    public CompletionStage<User> modifyCurrentUser(@Nullable final String username, @Nullable final byte[] avatar) {
        return modifyCurrentUser(username, avatar == null ? null : Utils.asImageDataUri(avatar));
    }
    
    @Nonnull
    @CheckReturnValue
    public GuildPaginator getCurrentUserGuilds() {
        return new GuildPaginator(entityBuilder()) {
            @Nonnull
            @Override
            protected CompletionStage<JsonArray> fetchNext(@Nonnull final RequestState<PartialGuild> state, @Nullable final String lastId, final int requestSize) {
                return getCurrentUserGuildsRaw(null, lastId, state.entitiesToFetch());
            }
        };
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<PartialGuild>> getCurrentUserGuilds(@Nullable final String before, @Nullable final String after,
                                                                    @Nonnegative final int limit) {
        return getCurrentUserGuildsRaw(before, after, limit)
                .thenApply(mapObjectContents(entityBuilder()::createPartialGuild));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> getCurrentUserGuildsRaw(@Nullable final String before, @Nullable final String after,
                                                              @Nonnegative final int limit) {
        final QueryStringBuilder builder = new QueryStringBuilder();
        
        if(before != null) {
            builder.append("before", before);
        }
        
        if(after != null) {
            builder.append("before", after);
        }
        
        if(limit <= 100) {
            builder.append("limit", Integer.toString(limit));
        }
        final String query = builder.build();
        
        return catnip().requester().queue(new OutboundRequest(Routes.GET_CURRENT_USER_GUILDS.withQueryString(query),
                ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<DMChannel> createDM(@Nonnull final String recipientId) {
        return createDMRaw(recipientId)
                .thenApply(entityBuilder()::createUserDM);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> createDMRaw(@Nonnull final String recipientId) {
        return catnip().requester().queue(new OutboundRequest(Routes.CREATE_DM, ImmutableMap.of(),
                new JsonObject().put("recipient_id", recipientId)))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    public CompletionStage<Void> leaveGuild(@Nonnull final String guildId) {
        return catnip().requester().queue(new OutboundRequest(Routes.LEAVE_GUILD.withMajorParam(guildId),
                ImmutableMap.of()))
                .thenApply(__ -> null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<ApplicationInfo> getCurrentApplicationInformation() {
        return getCurrentApplicationInformationRaw().thenApply(entityBuilder()::createApplicationInfo);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getCurrentApplicationInformationRaw() {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_CURRENT_APPLICATION_INFORMATION,
                ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<GatewayInfo> getGatewayBot() {
        return getGatewayBotRaw().thenApply(e -> entityBuilder().createGatewayInfo(e));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGatewayBotRaw() {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GATEWAY_BOT, ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
}

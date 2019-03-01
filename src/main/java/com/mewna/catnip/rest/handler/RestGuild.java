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
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.guild.*;
import com.mewna.catnip.entity.guild.Guild.GuildEditFields;
import com.mewna.catnip.entity.guild.audit.ActionType;
import com.mewna.catnip.entity.guild.audit.AuditLogEntry;
import com.mewna.catnip.entity.misc.CreatedInvite;
import com.mewna.catnip.entity.misc.VoiceRegion;
import com.mewna.catnip.internal.CatnipImpl;
import com.mewna.catnip.rest.ResponsePayload;
import com.mewna.catnip.rest.Routes;
import com.mewna.catnip.rest.guild.*;
import com.mewna.catnip.rest.requester.Requester.OutboundRequest;
import com.mewna.catnip.util.QueryStringBuilder;
import com.mewna.catnip.util.Utils;
import com.mewna.catnip.util.pagination.AuditLogPaginator;
import com.mewna.catnip.util.pagination.MemberPaginator;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletionStage;

import static com.mewna.catnip.util.JsonUtil.mapObjectContents;

/**
 * @author amy
 * @since 9/3/18.
 */
@SuppressWarnings({"unused", "WeakerAccess"})
public class RestGuild extends RestHandler {
    public RestGuild(final CatnipImpl catnip) {
        super(catnip);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> modifyGuildMember(@Nonnull final String guildId, @Nonnull final String memberId,
                                                   @Nonnull final MemberData data, @Nullable final String reason) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.MODIFY_GUILD_MEMBER.withMajorParam(guildId),
                        ImmutableMap.of("user.id", memberId), data.toJson(), reason))
                .thenApply(__ -> null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> modifyGuildMember(@Nonnull final String guildId, @Nonnull final String memberId,
                                                   @Nonnull final MemberData data) {
        return modifyGuildMember(guildId, memberId, data, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> modifyGuildChannelPositions(@Nonnull final PositionUpdater updater,
                                                             @Nullable final String reason) {
        final JsonArray array = new JsonArray();
        updater.entries()
                .stream()
                .map(x -> new JsonObject().put("id", x.getKey()).put("position", x.getValue()))
                .forEach(array::add);
        return catnip().requester()
                .queue(new OutboundRequest(Routes.MODIFY_GUILD_CHANNEL_POSITIONS.withMajorParam(updater.guildId()),
                        ImmutableMap.of(), array, reason))
                .thenApply(__ -> null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> modifyGuildChannelPositions(@Nonnull final PositionUpdater updater) {
        return modifyGuildChannelPositions(updater, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> modifyGuildRolePositions(@Nonnull final PositionUpdater updater,
                                                          @Nullable final String reason) {
        final JsonArray array = new JsonArray();
        updater.entries()
                .stream()
                .map(x -> new JsonObject().put("id", x.getKey()).put("position", x.getValue()))
                .forEach(array::add);
        return catnip().requester()
                .queue(new OutboundRequest(Routes.MODIFY_GUILD_ROLE_POSITIONS.withMajorParam(updater.guildId()),
                        ImmutableMap.of(), array, reason))
                .thenApply(__ -> null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> modifyGuildRolePositions(@Nonnull final PositionUpdater updater) {
        return modifyGuildRolePositions(updater, null);
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public CompletionStage<GuildChannel> createGuildChannel(@Nonnull final String guildId, @Nonnull final ChannelData data,
                                                            @Nullable final String reason) {
        return createGuildChannelRaw(guildId, data, reason).thenApply(entityBuilder()::createGuildChannel);
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public CompletionStage<GuildChannel> createGuildChannel(@Nonnull final String guildId, @Nonnull final ChannelData data) {
        return createGuildChannel(guildId, data, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> createGuildChannelRaw(@Nonnull final String guildId, @Nonnull final ChannelData data,
                                                             @Nullable final String reason) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.CREATE_GUILD_CHANNEL.withMajorParam(guildId),
                        ImmutableMap.of(), data.toJson(), reason))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<GuildEmbed> getGuildEmbed(@Nonnull final String guildId) {
        return getGuildEmbedRaw(guildId).thenApply(entityBuilder()::createGuildEmbed);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGuildEmbedRaw(@Nonnull final String guildId) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.GET_GUILD_EMBED.withMajorParam(guildId),
                        ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<GuildEmbed> modifyGuildEmbed(@Nonnull final String guildId, @Nullable final String channelId,
                                                        final boolean enabled, @Nullable final String reason) {
        return modifyGuildEmbedRaw(guildId, channelId, enabled, reason).thenApply(entityBuilder()::createGuildEmbed);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<GuildEmbed> modifyGuildEmbed(@Nonnull final String guildId, @Nullable final String channelId,
                                                        final boolean enabled) {
        return modifyGuildEmbed(guildId, channelId, enabled, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> modifyGuildEmbedRaw(@Nonnull final String guildId, @Nullable final String channelId,
                                                           final boolean enabled, @Nullable final String reason) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.MODIFY_GUILD_EMBED.withMajorParam(guildId),
                        ImmutableMap.of(), new JsonObject().put("channel_id", channelId).put("enabled", enabled), reason))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public CompletionStage<Role> createGuildRole(@Nonnull final String guildId, @Nonnull final RoleData roleData,
                                                 @Nullable final String reason) {
        return createGuildRoleRaw(guildId, roleData, reason).thenApply(obj -> entityBuilder().createRole(guildId, obj));
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public CompletionStage<Role> createGuildRole(@Nonnull final String guildId, @Nonnull final RoleData roleData) {
        return createGuildRole(guildId, roleData, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> createGuildRoleRaw(@Nonnull final String guildId, @Nonnull final RoleData roleData,
                                                          @Nullable final String reason) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.CREATE_GUILD_ROLE.withMajorParam(guildId),
                        ImmutableMap.of(), roleData.toJson(), reason))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public CompletionStage<Role> modifyGuildRole(@Nonnull final String guildId, @Nonnull final String roleId,
                                                 @Nonnull final RoleData roleData, @Nullable final String reason) {
        return modifyGuildRoleRaw(guildId, roleId, roleData, reason)
                .thenApply(obj -> entityBuilder().createRole(guildId, obj));
    }
    
    public CompletionStage<Role> modifyGuildRole(@Nonnull final String guildId, @Nonnull final String roleId,
                                                 @Nonnull final RoleData roleData) {
        return modifyGuildRole(guildId, roleId, roleData, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> modifyGuildRoleRaw(@Nonnull final String guildId, @Nonnull final String roleId,
                                                          @Nonnull final RoleData roleData, @Nullable final String reason) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.MODIFY_GUILD_ROLE.withMajorParam(guildId),
                        ImmutableMap.of("role.id", roleId), roleData.toJson(), reason))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> deleteGuildRole(@Nonnull final String guildId, @Nonnull final String roleId,
                                                 @Nullable final String reason) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.DELETE_GUILD_ROLE.withMajorParam(guildId),
                        ImmutableMap.of("role.id", roleId)).reason(reason))
                .thenApply(__ -> null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Void> deleteGuildRole(@Nonnull final String guildId, @Nonnull final String roleId) {
        return deleteGuildRole(guildId, roleId, null);
    }
    
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<Role>> getGuildRoles(@Nonnull final String guildId) {
        return getGuildRolesRaw(guildId)
                .thenApply(mapObjectContents(e -> entityBuilder().createRole(guildId, e)))
                .thenApply(Collections::unmodifiableList);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> getGuildRolesRaw(@Nonnull final String guildId) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.GET_GUILD_ROLES.withMajorParam(guildId),
                        ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Guild> getGuild(@Nonnull final String guildId) {
        return getGuildRaw(guildId).thenApply(entityBuilder()::createGuild);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGuildRaw(@Nonnull final String guildId) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.GET_GUILD.withMajorParam(guildId),
                        ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Guild> createGuild(@Nonnull final GuildData guild) {
        return createGuildRaw(guild).thenApply(entityBuilder()::createGuild);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> createGuildRaw(@Nonnull final GuildData guild) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.CREATE_GUILD,
                        ImmutableMap.of(), guild.toJson()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    public CompletionStage<Void> deleteGuild(@Nonnull final String guildId) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.DELETE_GUILD.withMajorParam(guildId),
                        ImmutableMap.of()))
                .thenApply(__ -> null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<GuildChannel>> getGuildChannels(@Nonnull final String guildId) {
        return getGuildChannelsRaw(guildId)
                .thenApply(mapObjectContents(entityBuilder()::createChannel))
                // All elements are guaranteed to be instances of GuildChannel,
                // so it's safe to do a cast, plus this way we avoid copying the list.
                .thenApply(RestHandler::uncheckedCast);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> getGuildChannelsRaw(@Nonnull final String guildId) {
        return catnip().requester()
                .queue(new OutboundRequest(Routes.GET_GUILD_CHANNELS.withMajorParam(guildId),
                        ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<CreatedInvite>> getGuildInvites(@Nonnull final String guildId) {
        return getGuildInvitesRaw(guildId).thenApply(mapObjectContents(entityBuilder()::createCreatedInvite));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> getGuildInvitesRaw(@Nonnull final String guildId) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_INVITES.withMajorParam(guildId),
                ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    @Nonnull
    public CompletionStage<Guild> modifyGuild(@Nonnull final String guildId, @Nonnull final GuildEditFields fields, @Nullable final String reason) {
        return modifyGuildRaw(guildId, fields, reason).thenApply(entityBuilder()::createGuild);
    }
    
    public CompletionStage<Guild> modifyGuild(@Nonnull final String guildId, @Nonnull final GuildEditFields fields) {
        return modifyGuild(guildId, fields, null);
    }
    
    @Nonnull
    public CompletionStage<JsonObject> modifyGuildRaw(@Nonnull final String guildId, @Nonnull final GuildEditFields fields,
                                                      @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.MODIFY_GUILD.withMajorParam(guildId),
                ImmutableMap.of(), fields.payload(), reason))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public MemberPaginator listGuildMembers(@Nonnull final String guildId) {
        return new MemberPaginator(entityBuilder(), guildId) {
            @Nonnull
            @Override
            protected CompletionStage<JsonArray> fetchNext(@Nonnull final RequestState<Member> state, @Nullable final String lastId, final int requestSize) {
                return listGuildMembersRaw(guildId, state.entitiesToFetch(), lastId);
            }
        };
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<Member>> listGuildMembers(@Nonnull final String guildId, @Nonnegative final int limit,
                                                          @Nullable final String after) {
        return listGuildMembersRaw(guildId, limit, after)
                .thenApply(mapObjectContents(o -> entityBuilder().createMember(guildId, o)));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> listGuildMembersRaw(@Nonnull final String guildId, @Nonnegative final int limit,
                                                          @Nullable final String after) {
        
        final QueryStringBuilder builder = new QueryStringBuilder();
        
        if(limit > 0) {
            builder.append("limit", Integer.toString(limit));
        }
        if(after != null && !after.isEmpty()) {
            builder.append("after", after);
        }
        
        final String query = builder.build();
        
        return catnip().requester().queue(new OutboundRequest(Routes.LIST_GUILD_MEMBERS.withMajorParam(guildId).withQueryString(query),
                ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<GuildBan>> getGuildBans(@Nonnull final String guildId) {
        return getGuildBansRaw(guildId).thenApply(mapObjectContents(entityBuilder()::createGuildBan));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> getGuildBansRaw(@Nonnull final String guildId) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_BANS.withMajorParam(guildId),
                ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<GuildBan> getGuildBan(@Nonnull final String guildId, @Nonnull final String userId) {
        return getGuildBanRaw(guildId, userId).thenApply(entityBuilder()::createGuildBan);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGuildBanRaw(@Nonnull final String guildId, @Nonnull final String userId) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_BAN.withMajorParam(guildId),
                ImmutableMap.of("user.id", userId)))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    public CompletionStage<Void> createGuildBan(@Nonnull final String guildId, @Nonnull final String userId,
                                                @Nullable final String reason,
                                                @Nonnegative final int deleteMessageDays) {
        final QueryStringBuilder builder = new QueryStringBuilder();
        if(reason != null) {
            builder.append("reason", Utils.encodeUTF8(reason));
        }
        if(deleteMessageDays <= 7) {
            builder.append("delete-message-days" + deleteMessageDays);
        }
        final String query = builder.build();
        return catnip().requester().queue(new OutboundRequest(Routes.CREATE_GUILD_BAN.withMajorParam(guildId).withQueryString(query),
                ImmutableMap.of("user.id", userId)).reason(reason))
                .thenApply(e -> null);
    }
    
    @Nonnull
    public CompletionStage<Void> createGuildBan(@Nonnull final String guildId, @Nonnull final String userId,
                                                @Nonnegative final int deleteMessageDays) {
        return createGuildBan(guildId, userId, null, deleteMessageDays);
    }
    
    @Nonnull
    public CompletionStage<Void> removeGuildBan(@Nonnull final String guildId, @Nonnull final String userId,
                                                @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.REMOVE_GUILD_BAN.withMajorParam(guildId),
                ImmutableMap.of("user.id", userId)).reason(reason))
                .thenApply(e -> null);
    }
    
    @Nonnull
    public CompletionStage<Void> removeGuildBan(@Nonnull final String guildId, @Nonnull final String userId) {
        return removeGuildBan(guildId, userId, null);
    }
    
    @Nonnull
    public CompletionStage<String> modifyCurrentUsersNick(@Nonnull final String guildId, @Nullable final String nick,
                                                          @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.MODIFY_CURRENT_USERS_NICK.withQueryString(guildId),
                ImmutableMap.of(), new JsonObject().put("nick", nick), reason))
                .thenApply(ResponsePayload::string);
    }
    
    @Nonnull
    public CompletionStage<String> modifyCurrentUsersNick(@Nonnull final String guildId, @Nullable final String nick) {
        return modifyCurrentUsersNick(guildId, nick, null);
    }
    
    @Nonnull
    public CompletionStage<Void> removeGuildMember(@Nonnull final String guildId, @Nonnull final String userId,
                                                   @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.REMOVE_GUILD_MEMBER.withMajorParam(guildId),
                ImmutableMap.of("user.id", userId)).reason(reason))
                .thenApply(e -> null);
    }
    
    @Nonnull
    public CompletionStage<Void> removeGuildMember(@Nonnull final String guildId, @Nonnull final String userId) {
        return removeGuildMember(guildId, userId, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Member> getGuildMember(@Nonnull final String guildId, @Nonnull final String userId) {
        return getGuildMemberRaw(guildId, userId).thenApply(e -> entityBuilder().createMember(guildId, e));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGuildMemberRaw(@Nonnull final String guildId, @Nonnull final String userId) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_MEMBER.withMajorParam(guildId),
                ImmutableMap.of("user.id", userId)))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    public CompletionStage<Void> removeGuildMemberRole(@Nonnull final String guildId, @Nonnull final String userId,
                                                       @Nonnull final String roleId, @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.REMOVE_GUILD_MEMBER_ROLE.withMajorParam(guildId),
                ImmutableMap.of("user.id", userId, "role.id", roleId)).reason(reason))
                .thenApply(e -> null);
    }
    @Nonnull
    public CompletionStage<Void> removeGuildMemberRole(@Nonnull final String guildId, @Nonnull final String userId,
                                                       @Nonnull final String roleId) {
        return removeGuildMemberRole(guildId, userId, roleId, null);
    }
    
    @Nonnull
    public CompletionStage<Void> addGuildMemberRole(@Nonnull final String guildId, @Nonnull final String userId,
                                                    @Nonnull final String roleId, @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.ADD_GUILD_MEMBER_ROLE.withMajorParam(guildId),
                ImmutableMap.of("user.id", userId, "role.id", roleId)).reason(reason))
                .thenApply(e -> null);
    }
    @Nonnull
    public CompletionStage<Void> addGuildMemberRole(@Nonnull final String guildId, @Nonnull final String userId,
                                                    @Nonnull final String roleId) {
        return addGuildMemberRole(guildId, userId, roleId, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Integer> getGuildPruneCount(@Nonnull final String guildId, @Nonnegative final int days) {
        return getGuildPruneCountRaw(guildId, days).thenApply(e -> e.getInteger("pruned"));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGuildPruneCountRaw(@Nonnull final String guildId, @Nonnegative final int days) {
        final String query = new QueryStringBuilder().append("days", Integer.toString(days)).build();
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_PRUNE_COUNT
                .withMajorParam(guildId).withQueryString(query), ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Integer> beginGuildPrune(@Nonnull final String guildId, @Nonnegative final int days) {
        return beginGuildPruneRaw(guildId, days).thenApply(e -> e.getInteger("pruned"));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> beginGuildPruneRaw(@Nonnull final String guildId, @Nonnegative final int days) {
        final String query = new QueryStringBuilder().append("days", Integer.toString(days)).build();
        
        return catnip().requester().queue(new OutboundRequest(Routes.BEGIN_GUILD_PRUNE
                .withMajorParam(guildId).withQueryString(query), ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<VoiceRegion>> getGuildVoiceRegions(@Nonnull final String guildId) {
        return getGuildVoiceRegionsRaw(guildId).thenApply(mapObjectContents(entityBuilder()::createVoiceRegion));
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonArray> getGuildVoiceRegionsRaw(@Nonnull final String guildId) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_VOICE_REGIONS.withQueryString(guildId),
                ImmutableMap.of()))
                .thenApply(ResponsePayload::array);
    }
    
    public AuditLogPaginator getGuildAuditLog(@Nonnull final String guildId) {
        return new AuditLogPaginator(entityBuilder()) {
            @Nonnull
            @CheckReturnValue
            @Override
            protected CompletionStage<JsonObject> fetchNext(@Nonnull final RequestState<AuditLogEntry> state, @Nullable final String lastId,
                                                            @Nonnegative final int requestSize) {
                return getGuildAuditLogRaw(guildId, state.extra("user"), lastId, state.extra("type"), requestSize);
            }
        };
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<List<AuditLogEntry>> getGuildAuditLog(@Nonnull final String guildId, @Nullable final String userId,
                                                                 @Nullable final String beforeEntryId, @Nullable final ActionType type,
                                                                 @Nonnegative final int limit) {
        return getGuildAuditLogRaw(guildId, userId, beforeEntryId, type, limit)
                .thenApply(entityBuilder()::createAuditLog);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getGuildAuditLogRaw(@Nonnull final String guildId, @Nullable final String userId,
                                                           @Nullable final String beforeEntryId, @Nullable final ActionType type,
                                                           @Nonnegative final int limit) {
        
        final QueryStringBuilder builder = new QueryStringBuilder();
        
        if(userId != null) {
            builder.append("user_id", userId);
        }
        
        if(beforeEntryId != null) {
            builder.append("before", beforeEntryId);
        }
        
        if(limit <= 100 && limit >= 1) {
            builder.append("limit", Integer.toString(limit));
        }
        
        if(type != null) {
            builder.append("action_type", type.toString());
        }
        
        final String query = builder.build();
        return catnip().requester().queue(new OutboundRequest(Routes.GET_GUILD_AUDIT_LOG.withMajorParam(guildId).withQueryString(query),
                ImmutableMap.of()))
                .thenApply(ResponsePayload::object);
    }
}

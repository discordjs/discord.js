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

package com.mewna.catnip.entity.channel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mewna.catnip.entity.guild.GuildEntity;
import com.mewna.catnip.entity.guild.PermissionOverride;
import com.mewna.catnip.entity.guild.PermissionOverride.OverrideType;
import com.mewna.catnip.entity.misc.CreatedInvite;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.rest.guild.PermissionOverrideData;
import com.mewna.catnip.rest.invite.InviteCreateOptions;
import com.mewna.catnip.util.PermissionUtil;
import io.vertx.core.json.JsonObject;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CompletionStage;
import java.util.function.Consumer;

/**
 * A channel in a guild.
 *
 * @author natanbc
 * @since 9/12/18
 */
@SuppressWarnings("unused")
public interface GuildChannel extends GuildEntity, Channel {
    /**
     * @return The name of the channel.
     */
    @Nonnull
    @CheckReturnValue
    String name();
    
    /**
     * @return The position of the channel.
     */
    @CheckReturnValue
    int position();
    
    /**
     * @return The id of the {@link Category} that is the parent of this
     * channel. May be {@code null}.
     */
    @Nullable
    @CheckReturnValue
    default String parentId() {
        final long id = parentIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The id of the {@link Category} that is the parent of this
     * channel. A value of {@code 0} means no parent.
     */
    @CheckReturnValue
    long parentIdAsLong();
    
    /**
     * @return The permission overrides set on this channel. Will never be
     * {@code null}, but may be empty.
     */
    @Nonnull
    @CheckReturnValue
    List<PermissionOverride> overrides();
    
    @Override
    @CheckReturnValue
    default boolean isDM() {
        return false;
    }
    
    @Override
    @CheckReturnValue
    default boolean isGroupDM() {
        return false;
    }
    
    @Override
    default boolean isUserDM() {
        return false;
    }
    
    @Override
    @CheckReturnValue
    default boolean isGuild() {
        return true;
    }
    
    /**
     * Creates a new invite to this channel.
     *
     * @param options The options to set on the invite.
     * @param reason The reason that will be visible in audit log
     *
     * @return A CompletionStage that completes when the invite is created.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<CreatedInvite> createInvite(@Nullable final InviteCreateOptions options,
                                                        @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), guildId(), id(), Permission.CREATE_INSTANT_INVITE);
        return catnip().rest().channel().createInvite(id(), options, reason);
    }
    
    /**
     * Creates a new invite to this channel.
     *
     * @param options The options to set on the invite.
     *
     * @return A CompletionStage that completes when the invite is created.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<CreatedInvite> createInvite(@Nullable final InviteCreateOptions options) {
      return createInvite(options, null);
    }
    
    /**
     * Creates a new invite to this channel.
     *
     * @return A CompletionStage that completes when the invite is created.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<CreatedInvite> createInvite() {
        PermissionUtil.checkPermissions(catnip(), guildId(), id(), Permission.CREATE_INSTANT_INVITE);
        return createInvite(null);
    }
    
    /**
     * The list of all invites to this channel. Will never be {@code null}, but
     * may be empty.
     *
     * @return A CompletionStage that completes when the invite is created.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<List<CreatedInvite>> fetchInvites() {
        PermissionUtil.checkPermissions(catnip(), guildId(), id(), Permission.MANAGE_CHANNELS);
        return catnip().rest().channel().getChannelInvites(id());
    }
    
    /**
     * Edit this channel.
     *
     * @return A channel editor that can complete the editing.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default ChannelEditFields edit() {
        PermissionUtil.checkPermissions(catnip(), guildId(), id(), Permission.MANAGE_CHANNELS);
        return new ChannelEditFields(this);
    }
    
    @SuppressWarnings({"unused", "WeakerAccess"})
    @Getter
    @Setter
    @Accessors(fluent = true)
    class ChannelEditFields {
        private final GuildChannel channel;
        private String name;
        private Integer position;
        private String topic;
        private Boolean nsfw;
        private Integer bitrate;
        private Integer userLimit;
        private Map<String, PermissionOverrideData> overrides = new HashMap<>();
        private String parentId;
        private Integer rateLimitPerUser;
        
        public ChannelEditFields(@Nullable final GuildChannel channel) {
            this.channel = channel;
        }
        
        public ChannelEditFields() {
            this(null);
        }
        
        @Nonnull
        @CheckReturnValue
        public PermissionOverrideData override(@Nonnull final String id, @Nonnull final OverrideType type) {
            return overrides.computeIfAbsent(id, __ -> new PermissionOverrideData(type, id));
        }
        
        @Nonnull
        @CheckReturnValue
        public PermissionOverrideData memberOverride(@Nonnull final String id) {
            return override(id, OverrideType.MEMBER);
        }
        
        @Nonnull
        @CheckReturnValue
        public PermissionOverrideData roleOverride(@Nonnull final String id) {
            return override(id, OverrideType.ROLE);
        }
        
        @Nonnull
        public ChannelEditFields override(@Nonnull final String id, @Nonnull final OverrideType type, @Nonnull final Consumer<PermissionOverrideData> configurator) {
            configurator.accept(override(id, type));
            return this;
        }
        
        @Nonnull
        public ChannelEditFields memberOverride(@Nonnull final String id, @Nonnull final Consumer<PermissionOverrideData> configurator) {
            return override(id, OverrideType.MEMBER, configurator);
        }
        
        @Nonnull
        public ChannelEditFields roleOverride(@Nonnull final String id, @Nonnull final Consumer<PermissionOverrideData> configurator) {
            return override(id, OverrideType.ROLE, configurator);
        }
        
        @Nonnull
        public CompletionStage<GuildChannel> submit(@Nullable final String reason) {
            if(channel == null) {
                throw new IllegalStateException("Cannot submit edit without a channel object! Please use RestChannel directly instead");
            }
            return channel.catnip().rest().channel().modifyChannel(channel.id(), this, reason);
        }
    
        @Nonnull
        public CompletionStage<GuildChannel> submit() {
            if(channel == null) {
                throw new IllegalStateException("Cannot submit edit without a channel object! Please use RestChannel directly instead");
            }
            return channel.catnip().rest().channel().modifyChannel(channel.id(), this, null);
        }
        
        @Nonnull
        @CheckReturnValue
        public JsonObject payload() {
            final JsonObject payload = new JsonObject();
            if(name != null && (channel == null || !Objects.equals(name, channel.name()))) {
                payload.put("name", name);
            }
            if(position != null && (channel == null || !Objects.equals(position, channel.position()))) {
                payload.put("position", position);
            }
            if(parentId != null && (channel == null || !Objects.equals(parentId, channel.parentId()))) {
                payload.put("parent_id", parentId);
            }
            if(overrides != null && !overrides.isEmpty()) {
                final Map<String, PermissionOverrideData> finalOverrides = new HashMap<>();
                if(channel != null) {
                    channel.overrides().forEach(override -> finalOverrides.put(override.id(), PermissionOverrideData.create(override)));
                }
                overrides.forEach(finalOverrides::put);
                final JsonObject object = new JsonObject();
                finalOverrides.forEach((k, v) -> object.put(k, v.toJson()));
                payload.put("permission_overwrites", object);
            }
            if(channel != null) {
                //TODO: throw if fields set on an unsupported channel type? (eg nsfw on voice channel)
                if(channel.isText()) {
                    final TextChannel text = channel.asTextChannel();
                    if(topic != null && !Objects.equals(topic, text.topic())) {
                        payload.put("topic", topic);
                    }
                    if(nsfw != null && !Objects.equals(nsfw, text.nsfw())) {
                        payload.put("nsfw", nsfw);
                    }
                    if(rateLimitPerUser != null && !Objects.equals(rateLimitPerUser, text.rateLimitPerUser())) {
                        payload.put("rate_limit_per_user", rateLimitPerUser);
                    }
                } else if(channel.isVoice()) {
                    final VoiceChannel voice = channel.asVoiceChannel();
                    if(bitrate != null && !Objects.equals(bitrate, voice.bitrate())) {
                        payload.put("bitrate", bitrate);
                    }
                    if(userLimit != null && !Objects.equals(userLimit, voice.userLimit())) {
                        payload.put("user_limit", userLimit);
                    }
                }
            } else {
                if(topic != null) {
                    payload.put("topic", topic);
                }
                if(nsfw != null) {
                    payload.put("nsfw", nsfw);
                }
                if(bitrate != null) {
                    payload.put("bitrate", bitrate);
                }
                if(userLimit != null) {
                    payload.put("user_limit", userLimit);
                }
                if(rateLimitPerUser != null) {
                    payload.put("rate_limit_per_user", rateLimitPerUser);
                }
            }
            return payload;
        }
    }
}

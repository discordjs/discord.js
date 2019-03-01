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
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.PermissionUtil;
import lombok.Getter;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.concurrent.CompletionStage;

/**
 * A Discord channel. A channel may not be attached to a guild (ex. in the case
 * of DMs).
 *
 * @author natanbc
 * @since 9/12/18
 */
@SuppressWarnings({"ClassReferencesSubclass", "unused"})
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS)
public interface Channel extends Snowflake {
    /**
     * @return The type of this channel.
     */
    @Nonnull
    @CheckReturnValue
    ChannelType type();
    
    /**
     * Deletes the channel. This operation cannot be undone.
     *
     * @param reason The reason that will be displayed in audit log
     *
     * @return A {@link CompletionStage} that is completed when the channel is
     * deleted.
     */
    @Nonnull
    default CompletionStage<Channel> delete(@Nullable final String reason) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.MANAGE_CHANNELS);
        }
        return catnip().rest().channel().deleteChannel(id(), reason);
    }
    
    /**
     * Deletes the channel. This operation cannot be undone.
     *
     * @return A {@link CompletionStage} that is completed when the channel is
     * deleted.
     */
    @Nonnull
    default CompletionStage<Channel> delete() {
        return delete(null);
    }
    
    /**
     * @return Whether or not this channel is a text channel.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isText() {
        return type() == ChannelType.TEXT;
    }
    
    /**
     * @return Whether or not this channel is a voice channel.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isVoice() {
        return type() == ChannelType.VOICE;
    }
    
    /**
     * @return Whether or not this channel is a category.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isCategory() {
        return type() == ChannelType.CATEGORY;
    }
    
    /**
     * @return Whether or not this channel is in a guild.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isGuild() {
        return type().isGuild();
    }
    
    /**
     * @return Whether or not this channel is a DM with a single user.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isUserDM() {
        return type() == ChannelType.DM;
    }
    
    /**
     * @return Whether or not this channel is a group DM with at least 1 other
     * user.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isGroupDM() {
        return type() == ChannelType.GROUP_DM;
    }
    
    /**
     * @return Whether or not this channel is a DM; see {@link #isUserDM()} and
     * {@link #isGroupDM()} for more.
     */
    @JsonIgnore
    @CheckReturnValue
    default boolean isDM() {
        return !type().isGuild();
    }
    
    /**
     * @return This channel instance as a {@link GuildChannel}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default GuildChannel asGuildChannel() {
        if(!isGuild()) {
            throw new UnsupportedOperationException("Not a guild channel");
        }
        return (GuildChannel) this;
    }
    
    /**
     * @return This channel instance as a {@link TextChannel}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default TextChannel asTextChannel() {
        if(!isText()) {
            throw new UnsupportedOperationException("Not a text channel");
        }
        return (TextChannel) this;
    }
    
    /**
     * @return This channel instance as a {@link VoiceChannel}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default VoiceChannel asVoiceChannel() {
        if(!isVoice()) {
            throw new UnsupportedOperationException("Not a voice channel");
        }
        return (VoiceChannel) this;
    }
    
    /**
     * @return This channel instance as a {@link Category}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default Category asCategory() {
        if(!isCategory()) {
            throw new UnsupportedOperationException("Not a category");
        }
        return (Category) this;
    }
    
    /**
     * @return This channel instance as a {@link DMChannel}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default DMChannel asDMChannel() {
        if(!isDM()) {
            throw new UnsupportedOperationException("Not a DM channel");
        }
        return (DMChannel) this;
    }
    
    /**
     * @return This channel instance as a {@link UserDMChannel}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default UserDMChannel asUserDMChannel() {
        if(!isUserDM()) {
            throw new UnsupportedOperationException("Not an user DM channel");
        }
        return (UserDMChannel) this;
    }
    
    /**
     * @return This channel instance as a {@link GroupDMChannel}.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default GroupDMChannel asGroupDMChannel() {
        if(!isGroupDM()) {
            throw new UnsupportedOperationException("Not a group DM channel");
        }
        return (GroupDMChannel) this;
    }
    
    /**
     * The type of a channel.
     */
    enum ChannelType {
        /**
         * A text channel in a guild.
         */
        TEXT(0, true),
        /**
         * A DM with a single user.
         */
        DM(1, false),
        /**
         * A voice channel in a guild.
         */
        VOICE(2, true),
        /**
         * A DM with multiple users.
         */
        GROUP_DM(3, false),
        /**
         * A guild channel category with zero or more child channels.
         */
        CATEGORY(4, true);
        
        @Getter
        private final int key;
        @Getter
        private final boolean guild;
        
        ChannelType(final int key, final boolean guild) {
            this.key = key;
            this.guild = guild;
        }
        
        @Nonnull
        public static ChannelType byKey(final int key) {
            for(final ChannelType level : values()) {
                if(level.key == key) {
                    return level;
                }
            }
            throw new IllegalArgumentException("No channel type for key " + key);
        }
    }
}

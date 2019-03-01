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

package com.mewna.catnip.entity.guild;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mewna.catnip.entity.Entity;
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.channel.Channel.ChannelType;
import com.mewna.catnip.entity.guild.Guild.VerificationLevel;
import com.mewna.catnip.entity.impl.InviteImpl;
import com.mewna.catnip.entity.util.ImageOptions;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.PermissionUtil;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.List;
import java.util.concurrent.CompletionStage;

/**
 * An invite to a guild.
 *
 * @author natanbc
 * @since 9/14/18
 */
@SuppressWarnings("unused")
@JsonDeserialize(as = InviteImpl.class)
public interface Invite extends Entity {
    /**
     * @return The code for this invite.
     */
    @Nonnull
    @CheckReturnValue
    String code();
    
    /**
     * @return The person who created the invite.
     */
    @Nonnull
    @CheckReturnValue
    Inviter inviter();
    
    /**
     * @return The guild the invite is for.
     */
    @Nonnull
    @CheckReturnValue
    InviteGuild guild();
    
    /**
     * @return The channel the member is for.
     */
    @Nonnull
    @CheckReturnValue
    InviteChannel channel();
    
    /**
     * @return The approximate number of people online in the guild.
     */
    @Nonnegative
    int approximatePresenceCount();
    
    /**
     * @return The approximate number of people in the guild.
     */
    @Nonnegative
    int approximateMemberCount();
    
    /**
     * Deletes the invite.
     *
     * @param reason The reason that will be displayed in audit log
     *
     * @return A CompletionStage that completes when the invite is deleted.
     */
    @Nonnull
    default CompletionStage<Invite> delete(@Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), guild().id(), channel().id(),
                Permission.MANAGE_CHANNELS);
        return catnip().rest().invite().deleteInvite(code(), reason);
    }
    
    /**
     * Deletes the invite.
     *
     * @return A CompletionStage that completes when the invite is deleted.
     */
    @Nonnull
    default CompletionStage<Invite> delete() {
        return delete(null);
    }
    
    @JsonDeserialize(as = InviteImpl.InviterImpl.class)
    interface Inviter extends Snowflake {
        @Nonnull
        @CheckReturnValue
        String username();
        
        @Nonnull
        @CheckReturnValue
        String discriminator();
        
        @Nonnull
        @CheckReturnValue
        String avatar();
        
        @CheckReturnValue
        boolean animatedAvatar();
        
        @Nonnull
        @CheckReturnValue
        String defaultAvatarUrl();
        
        @Nullable
        @CheckReturnValue
        String avatarUrl(@Nonnull ImageOptions options);
        
        @Nullable
        @CheckReturnValue
        String avatarUrl();
        
        @Nonnull
        @CheckReturnValue
        String effectiveAvatarUrl(@Nonnull ImageOptions options);
        
        @Nonnull
        @CheckReturnValue
        String effectiveAvatarUrl();
    }
    
    @JsonDeserialize(as = InviteImpl.InviteGuildImpl.class)
    interface InviteGuild extends Snowflake {
        @Nonnull
        @CheckReturnValue
        String name();
        
        @Nullable
        @CheckReturnValue
        String icon();
        
        @Nullable
        @CheckReturnValue
        String splash();
        
        @Nonnull
        @CheckReturnValue
        List<String> features();
        
        @Nonnull
        @CheckReturnValue
        VerificationLevel verificationLevel();
        
        @Nullable
        @CheckReturnValue
        String iconUrl(@Nonnull ImageOptions options);
        
        @Nullable
        @CheckReturnValue
        default String iconUrl() {
            return iconUrl(new ImageOptions());
        }
        
        @Nullable
        @CheckReturnValue
        String splashUrl(@Nonnull ImageOptions options);
        
        @Nullable
        @CheckReturnValue
        default String splashUrl() {
            return splashUrl(new ImageOptions());
        }
    }
    
    @JsonDeserialize(as = InviteImpl.InviteChannelImpl.class)
    interface InviteChannel extends Snowflake {
        @Nonnull
        @CheckReturnValue
        String name();
        
        @Nonnull
        @CheckReturnValue
        ChannelType type();
    }
}

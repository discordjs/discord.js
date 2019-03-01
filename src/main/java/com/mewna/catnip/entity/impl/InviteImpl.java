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

package com.mewna.catnip.entity.impl;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.RequiresCatnip;
import com.mewna.catnip.entity.channel.Channel.ChannelType;
import com.mewna.catnip.entity.guild.Guild.VerificationLevel;
import com.mewna.catnip.entity.guild.Invite;
import com.mewna.catnip.entity.util.ImageOptions;
import com.mewna.catnip.entity.util.ImageType;
import com.mewna.catnip.util.CDNFormat;
import lombok.*;
import lombok.experimental.Accessors;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.List;
import java.util.Objects;

/**
 * @author natanbc
 * @since 9/14/18.
 */
@Getter(onMethod_ = @JsonProperty)
@Setter(onMethod_ = @JsonProperty)
@Builder
@Accessors(fluent = true)
@NoArgsConstructor
@AllArgsConstructor
public class InviteImpl implements Invite, RequiresCatnip {
    @JsonIgnore
    private transient Catnip catnip;
    
    private String code;
    private Inviter inviter;
    private InviteGuild guild;
    private InviteChannel channel;
    private int approximatePresenceCount;
    private int approximateMemberCount;
    
    @Override
    public void catnip(@Nonnull final Catnip catnip) {
        this.catnip = catnip;
    }
    
    @Override
    public int hashCode() {
        return code.hashCode();
    }
    
    @Override
    public boolean equals(final Object obj) {
        return obj instanceof Invite && ((Invite) obj).code().equals(code);
    }
    
    @Override
    public String toString() {
        return String.format("Invite (%s)", code);
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @Accessors(fluent = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InviterImpl implements Inviter, RequiresCatnip {
        private transient Catnip catnip;
        
        private long idAsLong;
        private String username;
        private String discriminator;
        private String avatar;
        
        @Override
        public void catnip(@Nonnull final Catnip catnip) {
            this.catnip = catnip;
        }
        
        @Override
        public boolean animatedAvatar() {
            return avatar != null && avatar.startsWith("a_");
        }
        
        @Nonnull
        @Override
        public String defaultAvatarUrl() {
            return CDNFormat.defaultAvatarUrl(discriminator);
        }
        
        @Nullable
        @Override
        public String avatarUrl(@Nonnull final ImageOptions options) {
            return CDNFormat.avatarUrl(id(), avatar, options);
        }
        
        @Nullable
        @Override
        public String avatarUrl() {
            return avatarUrl(defaultOptions());
        }
        
        @Nonnull
        @Override
        public String effectiveAvatarUrl(@Nonnull final ImageOptions options) {
            return avatar == null ? defaultAvatarUrl() : Objects.requireNonNull(
                    avatarUrl(options),
                    "Avatar url is null but avatar hash is present (??)"
            );
        }
        
        @Nonnull
        @Override
        public String effectiveAvatarUrl() {
            return effectiveAvatarUrl(defaultOptions());
        }
        
        private ImageOptions defaultOptions() {
            return new ImageOptions().type(animatedAvatar() ? ImageType.GIF : null);
        }
        
        @Override
        public int hashCode() {
            return Long.hashCode(idAsLong);
        }
        
        @Override
        public boolean equals(final Object obj) {
            return obj instanceof Inviter && ((Inviter) obj).idAsLong() == idAsLong;
        }
        
        @Override
        public String toString() {
            return String.format("Inviter (%s)", username);
        }
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @Accessors(fluent = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InviteGuildImpl implements InviteGuild, RequiresCatnip {
        private transient Catnip catnip;
        
        private long idAsLong;
        private String name;
        private String icon;
        private String splash;
        private List<String> features;
        private VerificationLevel verificationLevel;
        
        @Override
        public void catnip(@Nonnull final Catnip catnip) {
            this.catnip = catnip;
        }
        
        @Nullable
        @Override
        public String iconUrl(@Nonnull final ImageOptions options) {
            return CDNFormat.iconUrl(id(), icon, options);
        }
        
        @Nullable
        @Override
        public String splashUrl(@Nonnull final ImageOptions options) {
            return CDNFormat.splashUrl(id(), splash, options);
        }
        
        @Override
        public int hashCode() {
            return Long.hashCode(idAsLong);
        }
        
        @Override
        public boolean equals(final Object obj) {
            return obj instanceof InviteGuild && ((InviteGuild) obj).idAsLong() == idAsLong;
        }
        
        @Override
        public String toString() {
            return String.format("InviteGuild (%s)", name);
        }
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @Accessors(fluent = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InviteChannelImpl implements InviteChannel, RequiresCatnip {
        private transient Catnip catnip;
        
        private long idAsLong;
        private String name;
        private ChannelType type;
        
        @Override
        public void catnip(@Nonnull final Catnip catnip) {
            this.catnip = catnip;
        }
        
        @Override
        public int hashCode() {
            return Long.hashCode(idAsLong);
        }
        
        @Override
        public boolean equals(final Object obj) {
            return obj instanceof InviteChannel && ((InviteChannel) obj).idAsLong() == idAsLong;
        }
        
        @Override
        public String toString() {
            return String.format("InviteChannel (%s)", name);
        }
    }
}

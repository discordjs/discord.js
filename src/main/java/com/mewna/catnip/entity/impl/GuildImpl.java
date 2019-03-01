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
import com.mewna.catnip.entity.Timestamped;
import com.mewna.catnip.entity.guild.Guild;
import com.mewna.catnip.entity.util.ImageOptions;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.CDNFormat;
import lombok.*;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

/**
 * @author natanbc
 * @since 9/6/18.
 */
@Getter(onMethod_ = @JsonProperty)
@Setter(onMethod_ = @JsonProperty)
@Builder
@Accessors(fluent = true)
@NoArgsConstructor
@AllArgsConstructor
public class GuildImpl implements Guild, RequiresCatnip, Timestamped {
    @JsonIgnore
    private transient Catnip catnip;
    
    private long idAsLong;
    private String name;
    private String icon;
    private String splash;
    private boolean owned;
    private long ownerIdAsLong;
    private Set<Permission> permissions;
    private String region;
    private long afkChannelIdAsLong;
    private int afkTimeout;
    private boolean embedEnabled;
    private long embedChannelIdAsLong;
    private VerificationLevel verificationLevel;
    private NotificationLevel defaultMessageNotifications;
    private ContentFilterLevel explicitContentFilter;
    private List<String> features;
    private MFALevel mfaLevel;
    private long applicationIdAsLong;
    private boolean widgetEnabled;
    private long widgetChannelIdAsLong;
    private long systemChannelIdAsLong;
    @JsonProperty
    private String joinedAt;
    private boolean large;
    private boolean unavailable;
    
    @Override
    public void catnip(@Nonnull final Catnip catnip) {
        this.catnip = catnip;
    }
    
    @Override
    @Nullable
    @CheckReturnValue
    public String iconUrl(@Nonnull final ImageOptions options) {
        return CDNFormat.iconUrl(id(), icon, options);
    }
    
    @Override
    @Nullable
    @CheckReturnValue
    public String splashUrl(@Nonnull final ImageOptions options) {
        return CDNFormat.splashUrl(id(), splash, options);
    }
    
    @Nonnull
    @Override
    public OffsetDateTime joinedAt() {
        return parseTimestamp(joinedAt);
    }
    
    @Override
    public int hashCode() {
        return Long.hashCode(idAsLong);
    }
    
    @Override
    public boolean equals(final Object obj) {
        return obj instanceof Guild && ((Guild)obj).idAsLong() == idAsLong;
    }
    
    @Override
    public String toString() {
        return String.format("Guild (%s, %s)", name, idAsLong);
    }
}

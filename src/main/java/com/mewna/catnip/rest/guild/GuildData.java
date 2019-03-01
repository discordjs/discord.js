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

package com.mewna.catnip.rest.guild;

import com.mewna.catnip.entity.guild.Guild.ContentFilterLevel;
import com.mewna.catnip.entity.guild.Guild.NotificationLevel;
import com.mewna.catnip.entity.guild.Guild.VerificationLevel;
import com.mewna.catnip.util.JsonConvertible;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

@Accessors(fluent = true, chain = true)
@Getter
@Setter
@SuppressWarnings("WeakerAccess")
public class GuildData implements JsonConvertible {
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private final List<RoleData> roles = new ArrayList<>();
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private final List<ChannelData> channels = new ArrayList<>();
    
    private String name;
    private String region;
    private String base64Icon;
    private VerificationLevel verificationLevel;
    private NotificationLevel defaultNotificationLevel;
    private ContentFilterLevel explicitContentFilter;
    
    public GuildData(@Nonnull final String name) {
        name(name);
        createRole(); //public role
    }
    
    @Nonnull
    @CheckReturnValue
    public static GuildData create(@Nonnull final String name) {
        return new GuildData(name);
    }
    
    @SuppressWarnings("UnusedReturnValue")
    @Nonnull
    public GuildData name(final String name) {
        final String trimmed = name.trim();
        if(trimmed.length() < 2 || trimmed.length() > 100) {
            throw new IllegalArgumentException("Name must have 2-100 characters");
        }
        this.name = trimmed;
        return this;
    }
    
    @Nonnull
    public RoleData createRole() {
        final RoleData role = RoleData.create(roles.size());
        roles.add(role);
        return role;
    }
    
    @Nonnull
    public GuildData createRole(@Nonnull final Consumer<RoleData> configurator) {
        configurator.accept(createRole());
        return this;
    }
    
    @Nonnull
    public RoleData getRole(@Nonnegative final int id) {
        return roles.get(id);
    }
    
    @Nonnull
    public GuildData configureRole(@Nonnegative final int id, @Nonnull final Consumer<RoleData> configurator) {
        configurator.accept(getRole(id));
        return this;
    }
    
    @Nonnull
    public RoleData getPublicRole() {
        return getRole(0);
    }
    
    @Nonnull
    public GuildData configurePublicRole(@Nonnull final Consumer<RoleData> configurator) {
        configurator.accept(getRole(0));
        return this;
    }
    
    @Nonnull
    public GuildData removeRole(@Nonnull final RoleData role) {
        if(role.publicRole()) {
            throw new IllegalArgumentException("Cannot remove public role");
        }
        roles.remove(role);
        return this;
    }
    
    @Nonnull
    public GuildData removeRole(@Nonnegative final int id) {
        if(id == 0) {
            throw new IllegalArgumentException("Cannot remove public role");
        }
        roles.remove(id);
        return this;
    }
    
    @Nonnull
    public GuildData addRole(@Nonnull final RoleData role) {
        roles.add(role);
        return this;
    }
    
    @Nonnull
    public ChannelData createTextChannel(@Nonnull final String name) {
        final ChannelData channel = ChannelData.createText(name);
        channels.add(channel);
        return channel;
    }
    
    @Nonnull
    public GuildData createTextChannel(@Nonnull final String name, @Nonnull final Consumer<ChannelData> configurator) {
        configurator.accept(createTextChannel(name));
        return this;
    }
    
    @Nonnull
    public ChannelData createVoiceChannel(@Nonnull final String name) {
        final ChannelData channel = ChannelData.createVoice(name);
        channels.add(channel);
        return channel;
    }
    
    @Nonnull
    public GuildData createVoiceChannel(@Nonnull final String name, @Nonnull final Consumer<ChannelData> configurator) {
        configurator.accept(createVoiceChannel(name));
        return this;
    }
    
    @Nonnull
    public ChannelData getChannel(@Nonnegative final int position) {
        return channels.get(position);
    }
    
    @Nonnull
    public GuildData removeChannel(@Nonnull final ChannelData channel) {
        channels.remove(channel);
        return this;
    }
    
    @Nonnull
    public GuildData removeChannel(@Nonnegative final int position) {
        channels.remove(position);
        return this;
    }
    
    @Nonnull
    public GuildData addChannel(@Nonnull final ChannelData channel) {
        channels.add(channel);
        return this;
    }
    
    @Override
    @Nonnull
    @CheckReturnValue
    public JsonObject toJson() {
        final JsonObject object = new JsonObject().put("name", name);
        if(!channels.isEmpty()) {
            final JsonArray array = new JsonArray();
            for(final ChannelData data : channels) {
                array.add(data.toJson());
            }
            object.put("channels", array);
        }
        if(!roles.isEmpty()) {
            final JsonArray array = new JsonArray();
            for(final RoleData data : roles) {
                array.add(data.toJson());
            }
            object.put("roles", array);
        }
        if(region != null) {
            object.put("region", region);
        }
        if(base64Icon != null) {
            object.put("icon", base64Icon);
        }
        if(verificationLevel != null) {
            object.put("verification_level", verificationLevel.getKey());
        }
        if(defaultNotificationLevel != null) {
            object.put("default_message_notifications", defaultNotificationLevel.getKey());
        }
        if(explicitContentFilter != null) {
            object.put("explicit_content_filter", explicitContentFilter.getKey());
        }
        return object;
    }
}

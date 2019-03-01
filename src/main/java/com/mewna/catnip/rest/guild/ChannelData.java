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

import com.mewna.catnip.entity.channel.Category;
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.channel.TextChannel;
import com.mewna.catnip.entity.channel.VoiceChannel;
import com.mewna.catnip.entity.guild.Member;
import com.mewna.catnip.entity.guild.PermissionOverride;
import com.mewna.catnip.entity.guild.PermissionOverride.OverrideType;
import com.mewna.catnip.entity.guild.Role;
import com.mewna.catnip.util.JsonConvertible;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

@SuppressWarnings("unused")
@Accessors(fluent = true, chain = true)
@Getter
@Setter
public abstract class ChannelData implements JsonConvertible {
    private final Map<String, PermissionOverrideData> overrides = new HashMap<>();
    private final int type;
    private String name;
    private Integer position;
    private String topic;
    private String parentId;
    private Boolean nsfw;
    private Integer bitrate;
    private Integer userLimit;
    
    ChannelData(@Nonnegative final int type, @Nullable final String name) {
        this.type = type;
        this.name = name;
        if(type != 0 && type != 2 && type != 4) {
            throw new IllegalArgumentException("Type must be either 0 (text), 2 (voice) or 4 (category)");
        }
        if(name != null && (name.length() < 2 || name.length() > 100)) {
            throw new IllegalArgumentException("Name must have 2-100 characters");
        }
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("WeakerAccess")
    public static ChannelData createText(@Nonnull final String name) {
        return new TextChannelData(name.trim());
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("WeakerAccess")
    public static ChannelData createVoice(@Nonnull final String name) {
        return new VoiceChannelData(name.trim());
    }
    
    @Nonnull
    @CheckReturnValue
    public static ChannelData createCategory(@Nonnull final String name) {
        return new CategoryData(name.trim());
    }
    
    @Nonnull
    @CheckReturnValue
    public static ChannelData of(@Nonnull final TextChannel textChannel) {
        return new TextChannelData()
                .name(textChannel.name())
                .position(textChannel.position())
                .topic(textChannel.topic())
                .parentId(textChannel.parentId())
                .nsfw(textChannel.nsfw())
                .overrides(textChannel.overrides());
    }
    
    @Nonnull
    @CheckReturnValue
    public static ChannelData of(@Nonnull final VoiceChannel voiceChannel) {
        return new VoiceChannelData()
                .name(voiceChannel.name())
                .position(voiceChannel.position())
                .parentId(voiceChannel.parentId())
                .userLimit(voiceChannel.userLimit())
                .bitrate(voiceChannel.bitrate())
                .overrides(voiceChannel.overrides());
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public static ChannelData of(@Nonnull final Category category) {
        return new CategoryData()
                .name(category.name())
                .position(category.position())
                .overrides(category.overrides());
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public static ChannelData of(@Nonnull final GuildChannel channel) {
        if(channel.isText()) {
            return of(channel.asTextChannel());
        } else if(channel.isVoice()) {
            return of(channel.asVoiceChannel());
        } else {
            return of(channel.asCategory());
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public ChannelData category(@Nonnull final Category category) {
        parentId = category.id();
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public PermissionOverrideData createOverride(@Nonnull final RoleData role) {
        return createRoleOverride(String.valueOf(role.id()));
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public PermissionOverrideData createOverride(@Nonnull final Role role) {
        return createRoleOverride(role.id());
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("WeakerAccess")
    public PermissionOverrideData createRoleOverride(@Nonnull final String roleId) {
        return overrides.computeIfAbsent(roleId, __ -> new PermissionOverrideData(OverrideType.ROLE, roleId));
    }
    
    @Nonnull
    public ChannelData configureOverride(@Nonnull final RoleData role, @Nonnull final Consumer<PermissionOverrideData> configurator) {
        return configureRoleOverride(String.valueOf(role.id()), configurator);
    }
    
    @Nonnull
    @SuppressWarnings("TypeMayBeWeakened")
    public ChannelData configureOverride(@Nonnull final Role role, @Nonnull final Consumer<PermissionOverrideData> configurator) {
        return configureRoleOverride(role.id(), configurator);
    }
    
    @Nonnull
    @SuppressWarnings("WeakerAccess")
    public ChannelData configureRoleOverride(@Nonnull final String roleId, @Nonnull final Consumer<PermissionOverrideData> configurator) {
        configurator.accept(createRoleOverride(roleId));
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("TypeMayBeWeakened")
    public PermissionOverrideData createOverride(@Nonnull final Member member) {
        return createMemberOverride(member.id());
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("WeakerAccess")
    public PermissionOverrideData createMemberOverride(@Nonnull final String memberId) {
        return overrides.computeIfAbsent(memberId, __ -> new PermissionOverrideData(OverrideType.MEMBER, memberId));
    }
    
    @Nonnull
    @SuppressWarnings("TypeMayBeWeakened")
    public ChannelData configureOverride(@Nonnull final Member member, @Nonnull final Consumer<PermissionOverrideData> configurator) {
        return configureMemberOverride(member.id(), configurator);
    }
    
    @Nonnull
    @SuppressWarnings("WeakerAccess")
    public ChannelData configureMemberOverride(@Nonnull final String roleId, @Nonnull final Consumer<PermissionOverrideData> configurator) {
        configurator.accept(createMemberOverride(roleId));
        return this;
    }
    
    @Nonnull
    public ChannelData deleteOverride(@Nonnull final RoleData roleData) {
        return deleteOverride(String.valueOf(roleData.id()));
    }
    
    @Nonnull
    @SuppressWarnings("TypeMayBeWeakened")
    public ChannelData deleteOverride(@Nonnull final Role role) {
        return deleteOverride(role.id());
    }
    
    @Nonnull
    @SuppressWarnings("TypeMayBeWeakened")
    public ChannelData deleteOverride(@Nonnull final Member member) {
        return deleteOverride(member.id());
    }
    
    @Nonnull
    @SuppressWarnings("WeakerAccess")
    public ChannelData deleteOverride(@Nonnull final String targetId) {
        overrides.remove(targetId);
        return this;
    }
    
    @Override
    public int hashCode() {
        return name.hashCode();
    }
    
    @Override
    public boolean equals(final Object obj) {
        return obj == this;
    }
    
    @Override
    public String toString() {
        return "ChannelData (name = " + name + ')';
    }
    
    private ChannelData overrides(@Nonnull final Collection<PermissionOverride> overrideList) {
        for(final PermissionOverride o : overrideList) {
            overrides.put(o.id(), PermissionOverrideData.create(o));
        }
        return this;
    }
    
    @Override
    @Nonnull
    @CheckReturnValue
    public JsonObject toJson() {
        final JsonObject object = new JsonObject().put("type", type);
        if(name != null) {
            object.put("name", name);
        }
        if(position != null) {
            object.put("position", position);
        }
        if(topic != null) {
            object.put("topic", topic);
        }
        if(nsfw != null) {
            object.put("nsfw", nsfw);
        }
        if(bitrate != null) {
            object.put("bitrate", bitrate);
        }
        if(userLimit != null) {
            object.put("user_limit", userLimit);
        }
        if(parentId != null) {
            object.put("parent_id", parentId);
        }
        if(!overrides.isEmpty()) {
            final JsonArray array = new JsonArray();
            for(final PermissionOverrideData override : overrides.values()) {
                array.add(override.toJson());
            }
            object.put("permission_overwrites", array);
        }
        return object;
    }
    
    private static class CategoryData extends ChannelData {
        CategoryData(final String name) {
            super(4, name);
        }
        
        CategoryData() {
            super(4, null);
        }
        
        @Override
        public ChannelData parentId(final String parentId) {
            throw new UnsupportedOperationException("Cannot set parent ID on categories!");
        }
        
        @Nonnull
        @Override
        public ChannelData category(@Nonnull final Category category) {
            throw new UnsupportedOperationException("Cannot set parent on categories!");
        }
        
        @Override
        public ChannelData topic(final String topic) {
            throw new UnsupportedOperationException("Cannot set topic on categories");
        }
        
        @Override
        public ChannelData nsfw(final Boolean nsfw) {
            throw new UnsupportedOperationException("Cannot set nsfw on categories");
        }
        
        @Override
        public ChannelData bitrate(final Integer bitrate) {
            throw new UnsupportedOperationException("Cannot set bitrate on categories");
        }
        
        @Override
        public ChannelData userLimit(final Integer userLimit) {
            throw new UnsupportedOperationException("Cannot set user limit on categories");
        }
    }
    
    private static class TextChannelData extends ChannelData {
        TextChannelData(final String name) {
            super(0, name);
        }
        
        TextChannelData() {
            super(0, null);
        }
        
        @Override
        public ChannelData bitrate(final Integer bitrate) {
            throw new UnsupportedOperationException("Cannot set bitrate on text channels");
        }
        
        @Override
        public ChannelData userLimit(final Integer userLimit) {
            throw new UnsupportedOperationException("Cannot set user limit on text channels");
        }
    }
    
    private static class VoiceChannelData extends ChannelData {
        VoiceChannelData(final String name) {
            super(2, name);
        }
        
        VoiceChannelData() {
            super(2, null);
        }
        
        @Override
        public ChannelData topic(final String topic) {
            throw new UnsupportedOperationException("Cannot set topic on voice channels");
        }
        
        @Override
        public ChannelData nsfw(final Boolean nsfw) {
            throw new UnsupportedOperationException("Cannot set nsfw on voice channels");
        }
    }
}

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

import com.mewna.catnip.entity.guild.Role;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.JsonConvertible;
import io.vertx.core.json.JsonObject;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Arrays;
import java.util.function.LongUnaryOperator;

@Accessors(fluent = true)
@Getter
@Setter
@SuppressWarnings("WeakerAccess")
public class RoleData implements JsonConvertible {
    private final int id;
    private final boolean publicRole;
    private Long permissions;
    private String name;
    private Integer color;
    private Integer position;
    private Boolean mentionable;
    private Boolean hoisted;
    
    public RoleData(@Nonnegative final int id) {
        this.id = id;
        publicRole = id == 0;
    }
    
    @Nonnull
    @CheckReturnValue
    public static RoleData create(@Nonnegative final int id) {
        if(id == 0) {
            return new PublicRoleData();
        }
        return new RoleData(id);
    }
    
    @Nonnull
    @CheckReturnValue
    public static RoleData of(@Nonnull final Role role) {
        return create(-1)
                .permissions(role.permissions())
                .name(role.name())
                .color(role.color())
                .position(role.position())
                .mentionable(role.mentionable())
                .hoisted(role.hoist());
    }
    
    @Nonnull
    public RoleData permissions(@Nullable final Long permissions) {
        this.permissions = permissions;
        return this;
    }
    
    @Nonnull
    public RoleData permissions(@Nonnull final Permission... permissions) {
        return permissions(Permission.from(permissions));
    }
    
    @Nonnull
    public RoleData permissions(@Nonnull final Iterable<Permission> permissions) {
        return permissions(Permission.from(permissions));
    }
    
    @Nonnull
    public RoleData addPermissions(@Nonnull final Permission... permissions) {
        return addPermissions(Arrays.asList(permissions));
    }
    
    @Nonnull
    public RoleData addPermissions(@Nonnull final Iterable<Permission> permissions) {
        //1101 | 0010
        //1111
        return updatePermissions(v -> v | Permission.from(permissions));
    }
    
    @Nonnull
    public RoleData removePermissions(@Nonnull final Permission... permissions) {
        return addPermissions(Arrays.asList(permissions));
    }
    
    @Nonnull
    public RoleData removePermissions(@Nonnull final Iterable<Permission> permissions) {
        //1111 & ~0010
        //1111 & 1101
        //1101
        return updatePermissions(v -> v & ~Permission.from(permissions));
    }
    
    @Nonnull
    public RoleData updatePermissions(@Nonnull final LongUnaryOperator updater) {
        return permissions(updater.applyAsLong(permissions == null ? 0 : permissions));
    }
    
    @Override
    @Nonnull
    @CheckReturnValue
    public JsonObject toJson() {
        final JsonObject object = new JsonObject();
        if(id >= 0) {
            object.put("id", Integer.toString(id));
        }
        if(permissions != null) {
            object.put("permissions", permissions);
        }
        if(name != null) {
            object.put("name", name);
        }
        if(color != null) {
            object.put("color", color & 0xFFFFFF);
        }
        if(position != null) {
            object.put("position", position);
        }
        if(mentionable != null) {
            object.put("mentionable", mentionable);
        }
        if(hoisted != null) {
            object.put("hoisted", hoisted);
        }
        return object;
    }
    
    @Override
    public int hashCode() {
        return id;
    }
    
    @Override
    public boolean equals(final Object obj) {
        return obj instanceof RoleData && ((RoleData) obj).id == id;
    }
    
    @Override
    public String toString() {
        return "RoleData(id = " + id + ')';
    }
    
    private static class PublicRoleData extends RoleData {
        PublicRoleData() {
            super(0);
        }
        
        @Override
        public RoleData name(final String name) {
            throw new IllegalStateException("Cannot change name of public role");
        }
        
        @Override
        public RoleData color(final Integer color) {
            throw new IllegalStateException("Cannot change color of public role");
        }
        
        @Override
        public RoleData position(final Integer position) {
            throw new IllegalStateException("Cannot change position of public role");
        }
        
        @Override
        public RoleData mentionable(final Boolean mentionable) {
            throw new IllegalStateException("Cannot change mentionable of public role");
        }
        
        @Override
        public RoleData hoisted(final Boolean mentionable) {
            throw new IllegalStateException("Cannot change hoisted of public role");
        }
    }
}

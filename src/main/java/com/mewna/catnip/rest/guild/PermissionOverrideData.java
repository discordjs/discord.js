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

import com.mewna.catnip.entity.guild.Member;
import com.mewna.catnip.entity.guild.PermissionOverride;
import com.mewna.catnip.entity.guild.PermissionOverride.OverrideType;
import com.mewna.catnip.entity.guild.Role;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.JsonConvertible;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnull;
import java.util.Arrays;
import java.util.Collection;
import java.util.EnumSet;
import java.util.Set;

@SuppressWarnings("unused")
public class PermissionOverrideData implements JsonConvertible {
    private final Set<Permission> allow = EnumSet.noneOf(Permission.class);
    private final Set<Permission> deny = EnumSet.noneOf(Permission.class);
    private final OverrideType type;
    private final String targetId;
    
    public PermissionOverrideData(@Nonnull final OverrideType type, @Nonnull final String targetId) {
        this.type = type;
        this.targetId = targetId;
    }
    
    public static PermissionOverrideData create(@Nonnull final RoleData role) {
        return new PermissionOverrideData(OverrideType.ROLE, String.valueOf(role.id()));
    }
    
    @SuppressWarnings("TypeMayBeWeakened")
    public static PermissionOverrideData create(@Nonnull final Role role) {
        return new PermissionOverrideData(OverrideType.ROLE, role.id());
    }
    
    @SuppressWarnings("TypeMayBeWeakened")
    public static PermissionOverrideData create(@Nonnull final Member member) {
        return new PermissionOverrideData(OverrideType.MEMBER, member.id());
    }
    
    @SuppressWarnings("TypeMayBeWeakened")
    public static PermissionOverrideData create(@Nonnull final User user) {
        return new PermissionOverrideData(OverrideType.MEMBER, user.id());
    }
    
    public static PermissionOverrideData create(@Nonnull final PermissionOverride override) {
        return new PermissionOverrideData(override.type(), override.id())
                .allow(override.allow())
                .deny(override.deny());
    }
    
    public OverrideType type() {
        return type;
    }
    
    public PermissionOverrideData allow(@Nonnull final Permission... permissions) {
        return allow(Arrays.asList(permissions));
    }
    
    public PermissionOverrideData allow(@Nonnull final Collection<Permission> permissions) {
        deny.removeAll(permissions);
        allow.addAll(permissions);
        return this;
    }
    
    public PermissionOverrideData deny(@Nonnull final Permission... permissions) {
        return deny(Arrays.asList(permissions));
    }
    
    @SuppressWarnings("WeakerAccess")
    public PermissionOverrideData deny(@Nonnull final Collection<Permission> permissions) {
        allow.removeAll(permissions);
        deny.addAll(permissions);
        return this;
    }
    
    @Nonnull
    @Override
    public JsonObject toJson() {
        return new JsonObject()
                .put("id", targetId)
                .put("type", type.getKey())
                .put("allow", Permission.from(allow))
                .put("deny", Permission.from(deny));
    }
}

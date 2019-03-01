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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mewna.catnip.entity.Mentionable;
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.impl.RoleImpl;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.PermissionUtil;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Set;

/**
 * A role in a guild.
 *
 * @author amy
 * @since 9/4/18.
 */
@SuppressWarnings("unused")
@JsonDeserialize(as = RoleImpl.class)
public interface Role extends Mentionable, Comparable<Role>, PermissionHolder {
    /**
     * The name of the role. Not unique
     *
     * @return String containing the role name.
     */
    @Nonnull
    String name();
    
    /**
     * Integer representation of the role color.
     * <br>To use this, you must convert the integer to base-16, hex, format.
     * //TODO: Test default role color.
     *
     * @return The integer representation of the role color. Never null.
     */
    @CheckReturnValue
    int color();
    
    /**
     * Position of the role within the guild it's from.
     * <br><p>Note: Raw positions fetched from Discord are a bit weird and may confuse you sometimes.</p>
     *
     * @return The position of the role within its guild's role hierarchy.
     */
    @CheckReturnValue
    int position();
    
    /**
     * Whether or not the role "hoists" users with it into a group in the user list.
     *
     * @return True if the role is grouped and hoisted, false otherwise.
     */
    @CheckReturnValue
    boolean hoist();
    
    /**
     * Permissions this role grants users in the guild.
     * <br>Channels may override and add to or remove from this.
     *
     * @return Bit set of permissions granted by this role.
     */
    @CheckReturnValue
    long permissionsRaw();
    
    /**
     * Permissions this role grants users in the guild.
     * <br>Channels may override and add to or remove from this.
     *
     * @return Set of permissions granted by this role. Never null.
     */
    @Nonnull
    @CheckReturnValue
    default Set<Permission> permissions() {
        return Permission.toSet(permissionsRaw());
    }
    
    /**
     * Whether or not this role is managed by a 3rd party connection.
     * <br>Most often, this is seen on bots which were added using a permission parameter in their invite link.
     * <br>If true, this role cannot be modified by users through normal means.
     *
     * @return True if the role is managed, false otherwise.
     */
    @CheckReturnValue
    boolean managed();
    
    /**
     * Whether or not mentioning this role will effectively mention those with it.
     * <br>Roles can always be mentioned, but will not mention users with it unless this is true.
     *
     * @return True if the role is mentionable, false otherwise.
     */
    @CheckReturnValue
    boolean mentionable();
    
    /**
     * @return A mention for this role that can be sent in a message.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default String asMention() {
        return "<@&" + id() + '>';
    }
    
    @Override
    default boolean hasPermissions(@Nonnull final Collection<Permission> permissions) {
        final long needed = Permission.from(permissions);
        final long actual = Permission.from(permissions());
        return (actual & needed) == needed;
    }
    
    @Override
    default boolean hasPermissions(@Nonnull final GuildChannel channel, @Nonnull final Collection<Permission> permissions) {
        throw new UnsupportedOperationException("Roles does not support this method");
    }
    
    @Override
    default boolean canInteract(@Nonnull final Role role) {
        return PermissionUtil.canInteract(this, role);
    }
    
    @Override
    default boolean canInteract(@Nonnull final Member member) {
        return PermissionUtil.canInteract(this, member);
    }
    
    @Override
    default int compareTo(@Nonnull final Role o) {
        if(position() != o.position()) {
            return position() - o.position();
        }
        final long creationDiff = (o.idAsLong() >> 22) - (idAsLong() >> 22);
        return creationDiff > 0 ? 1 : creationDiff < 0 ? -1 : 0;
    }
}

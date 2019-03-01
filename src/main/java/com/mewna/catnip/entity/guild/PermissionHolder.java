package com.mewna.catnip.entity.guild;

import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.util.Permission;

import javax.annotation.Nonnull;
import java.util.Arrays;
import java.util.Collection;
import java.util.Set;

/**
 * An entity which is permission-scoped in catnip.
 *
 * @author schlaubi
 * @since 13/2/19.
 */
public interface PermissionHolder extends GuildEntity, Snowflake {
    
    /**
     * Returns a list of the entity's permissions.
     * @return a list of the entity's permissions
     */
    Set<Permission> permissions();
    
    /**
     * Returns the raw permissions of the entity as a long.
     * @return the raw permissions of the entity as a long
     */
    default long permissionsRaw() {
        return Permission.from(permissions());
    }
    
    /**
     * Checks whether the entity has the permissions or not.
     * @param permissions The permissions to check.
     * @return Whether the entity has the permissions or not
     */
    boolean hasPermissions(@Nonnull final Collection<Permission> permissions);
    
    /**
     * Checks whether the entity has the permissions or not.
     * @param permissions The permissions to check.
     * @return Whether the entity has the permissions or not
     */
    default boolean hasPermissions(@Nonnull final Permission... permissions) {
        return hasPermissions(Arrays.asList(permissions));
    }
    
    /**
     * Checks whether the entity has the permissions or not in a specific {@link GuildChannel}.
     * @param channel The channel in which the entity should have the permission
     * @param permissions The permissions to check.
     * @return Whether the entity has the permissions or not
     */
    boolean hasPermissions(@Nonnull final GuildChannel channel, @Nonnull final Collection<Permission> permissions);
    
    /**
     * Checks whether the entity has the permissions or not in a specific {@link GuildChannel}.
     * @param channel The channel in which the entity should have the permission.
     * @param permissions The permissions to check.
     * @return Whether the entity has the permissions or not
     */
    default boolean hasPermissions(@Nonnull final GuildChannel channel, @Nonnull final Permission... permissions) {
        return hasPermissions(channel, Arrays.asList(permissions));
    }
    
    /**
     * Checks whether the entity can interact with a role or not.
     * @param role The role the entity should interact with.
     * @return Whether the entity can interact with a role or not
     */
    boolean canInteract(@Nonnull final Role role);
    
    /**
     * Checks whether the entity can interact with a member or not.
     * @param member The member the entity should interact with.
     * @return Whether the entity can interact with a member or not
     */
    boolean canInteract(@Nonnull final Member member);
    
}

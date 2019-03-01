package com.mewna.catnip.util;

import com.mewna.catnip.entity.guild.PermissionHolder;
import lombok.Getter;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
public class HierarchyException extends RuntimeException {
    
    private final PermissionHolder actor;
    private final PermissionHolder target;
    
    public HierarchyException(final PermissionHolder actor, final PermissionHolder target) {
        super(message(actor, target));
        this.actor = actor;
        this.target = target;
    }
    
    private static String message(final PermissionHolder actor, final PermissionHolder target) {
        return "Could not interact with " + target;
    }
    
}

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
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.impl.PermissionOverrideImpl;
import com.mewna.catnip.entity.util.Permission;
import lombok.Getter;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import java.util.Set;

/**
 * @author natanbc
 * @since 9/15/18
 */
@JsonDeserialize(as = PermissionOverrideImpl.class)
public interface PermissionOverride extends Snowflake {
    @Nonnull
    @CheckReturnValue
    OverrideType type();
    
    @CheckReturnValue
    long allowRaw();
    
    @Nonnull
    @CheckReturnValue
    default Set<Permission> allow() {
        return Permission.toSet(allowRaw());
    }
    
    @CheckReturnValue
    long denyRaw();
    
    @Nonnull
    @CheckReturnValue
    default Set<Permission> deny() {
        return Permission.toSet(denyRaw());
    }
    
    enum OverrideType {
        ROLE("role"), MEMBER("member");
        
        @Getter
        private final String key;
        
        OverrideType(final String key) {
            this.key = key;
        }
        
        @Nonnull
        public static OverrideType byKey(final String key) {
            for(final OverrideType level : values()) {
                if(level.key.equals(key)) {
                    return level;
                }
            }
            throw new IllegalArgumentException("No override type for key " + key);
        }
    }
}

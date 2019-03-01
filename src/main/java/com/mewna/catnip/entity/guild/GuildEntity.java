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

import com.mewna.catnip.entity.Entity;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.PermissionUtil;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Objects;

/**
 * An entity which is guild-scoped in catnip.
 *
 * @author AdrianTodt
 * @since 1/19/19.
 */
public interface GuildEntity extends Entity {
    
    /**
     * The id of the guild this entity is from.
     *
     * @return String representing the guild ID.
     */
    @Nonnull
    @CheckReturnValue
    default String guildId() {
        return Long.toUnsignedString(guildIdAsLong());
    }
    
    /**
     * The id of the guild this entity is from.
     *
     * @return Long representing the guild ID.
     */
    @CheckReturnValue
    long guildIdAsLong();
    
    /**
     * The guild this entity is from.
     *
     * @return Guild represented by the guild ID.
     */
    @Nonnull
    @CheckReturnValue
    default Guild guild() {
        return Objects.requireNonNull(catnip().cache().guild(guildIdAsLong()),
                "Guild not found. It may have been removed from the cache");
    }
    
}

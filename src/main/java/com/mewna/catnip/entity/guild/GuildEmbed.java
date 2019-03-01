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
import com.mewna.catnip.entity.RequiresCatnip;
import com.mewna.catnip.entity.impl.GuildEmbedImpl;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nullable;

/**
 * A guild's embed.
 *
 * @author SamOphis
 * @since 10/18/2018
 */
@SuppressWarnings("unused")
@JsonDeserialize(as = GuildEmbedImpl.class)
public interface GuildEmbed extends RequiresCatnip {
    /**
     * @return Whether the embed is enabled.
     */
    @CheckReturnValue
    boolean enabled();
    
    /**
     * @return The id the embed is enabled for. {@code null} if not enabled.
     */
    @Nullable
    @CheckReturnValue
    default String channelId() {
        final long id = channelIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The id the embed is enabled for. {@code 0} if not enabled.
     */
    @CheckReturnValue
    long channelIdAsLong();
}

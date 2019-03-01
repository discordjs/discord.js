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

package com.mewna.catnip.entity.message;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mewna.catnip.entity.Entity;
import com.mewna.catnip.entity.impl.BulkDeletedMessagesImpl;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.List;

/**
 * Fired over the event bus when messages are bulk deleted.
 *
 * @author amy
 * @since 10/4/18.
 */
@JsonDeserialize(as = BulkDeletedMessagesImpl.class)
public interface BulkDeletedMessages extends Entity {
    /**
     * @return The ids of the messages that were deleted.
     */
    @Nonnull
    @CheckReturnValue
    List<String> ids();
    
    /**
     * @return The id of the channel the messages were deleted in.
     */
    @Nonnull
    @CheckReturnValue
    default String channelId() {
        return Long.toUnsignedString(channelIdAsLong());
    }
    
    /**
     * @return The id of the channel the messages were deleted in.
     */
    @CheckReturnValue
    long channelIdAsLong();
    
    /**
     * @return The id of the guild the messages were deleted in, if applicable.
     */
    @Nullable
    @CheckReturnValue
    default String guildId() {
        final long id = guildIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The id of the guild the messages were deleted in, if applicable.
     */
    @CheckReturnValue
    long guildIdAsLong();
}

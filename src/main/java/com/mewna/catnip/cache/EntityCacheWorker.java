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

package com.mewna.catnip.cache;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.guild.Member;
import com.mewna.catnip.entity.guild.Role;
import com.mewna.catnip.entity.misc.Emoji.CustomEmoji;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.entity.user.VoiceState;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Map;

/**
 * If you plan to write your own implementation of this class, be aware that
 * the contracts implied by the JSR-305 are *expected* to be followed, and you
 * *will* break things if you don't follow them.
 *
 * @author amy
 * @since 9/19/18.
 */
@SuppressWarnings("UnusedReturnValue")
public interface EntityCacheWorker extends EntityCache {
    /**
     * Update cache with a single gateway event.
     *
     * @param eventType Type of the event.
     * @param payload   Data payload contained in the event
     *
     * @return Itself.
     */
    @Nonnull
    @SuppressWarnings("UnusedReturnValue")
    Future<Void> updateCache(@Nonnull String eventType, @Nonnegative int shardId, @Nonnull JsonObject payload);
    
    void bulkCacheUsers(@Nonnegative int shardId, @Nonnull Collection<User> users);
    
    void bulkCacheChannels(@Nonnegative int shardId, @Nonnull Collection<GuildChannel> channels);
    
    void bulkCacheRoles(@Nonnegative int shardId, @Nonnull Collection<Role> roles);
    
    void bulkCacheMembers(@Nonnegative int shardId, @Nonnull Collection<Member> members);
    
    void bulkCacheEmoji(@Nonnegative int shardId, @Nonnull Collection<CustomEmoji> emoji);
    
    void bulkCachePresences(@Nonnegative int shardId, @Nonnull Map<String, Presence> presences);
    
    void bulkCacheVoiceStates(@Nonnegative int shardId, @Nonnull Collection<VoiceState> voiceStates);
    
    void invalidateShard(@Nonnegative int id);
    
    @Nonnull
    EntityCache catnip(@Nonnull Catnip catnip);
}

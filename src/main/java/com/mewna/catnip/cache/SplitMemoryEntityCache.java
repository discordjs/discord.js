/*
 * Copyright (c) 2018 amy, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 *  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 *  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.mewna.catnip.cache;

import com.mewna.catnip.cache.view.*;
import com.mewna.catnip.entity.channel.UserDMChannel;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.entity.user.User;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SplitMemoryEntityCache extends MemoryEntityCache {
    @SuppressWarnings("WeakerAccess")
    protected final Map<Integer, MutableNamedCacheView<User>> userCache = new ConcurrentHashMap<>();
    @SuppressWarnings("WeakerAccess")
    protected final Map<Integer, MutableCacheView<Presence>> presenceCache = new ConcurrentHashMap<>();
    @SuppressWarnings("WeakerAccess")
    protected final Map<Integer, MutableCacheView<UserDMChannel>> dmChannelCache = new ConcurrentHashMap<>();
    
    @Override
    public void invalidateShard(final int id) {
        super.invalidateShard(id);
        userCache.remove(id);
        dmChannelCache.remove(id);
        presenceCache.remove(id);
    }
    
    @Override
    protected MutableNamedCacheView<User> userCache(final int shardId) {
        return userCache.computeIfAbsent(shardId, __ -> createUserCacheView());
    }
    
    @Override
    protected MutableCacheView<UserDMChannel> dmChannelCache(final int shardId) {
        return dmChannelCache.computeIfAbsent(shardId, __ -> createDMChannelCacheView());
    }
    
    @Override
    protected MutableCacheView<Presence> presenceCache(final int shardId) {
        return presenceCache.computeIfAbsent(shardId, __ -> createPresenceCacheView());
    }
    
    @Nullable
    @Override
    public User user(final long id) {
        for(final CacheView<User> cache : userCache.values()) {
            final User user = cache.getById(id);
            if(user != null) {
                return user;
            }
        }
        return null;
    }
    
    @Nonnull
    @Override
    public NamedCacheView<User> users() {
        return new CompositeNamedCacheView<>(userCache.values(), User::username);
    }
    
    @Nullable
    @Override
    public Presence presence(final long id) {
        for(final CacheView<Presence> cache : presenceCache.values()) {
            final Presence presence = cache.getById(id);
            if(presence != null) {
                return presence;
            }
        }
        return null;
    }
    
    @Nonnull
    @Override
    public CacheView<Presence> presences() {
        return new CompositeCacheView<>(presenceCache.values());
    }
    
    @Nullable
    @Override
    public UserDMChannel dmChannel(final long id) {
        for(final CacheView<UserDMChannel> cache : dmChannelCache.values()) {
            final UserDMChannel channel = cache.getById(id);
            if(channel != null) {
                return channel;
            }
        }
        return null;
    }
    
    @Nonnull
    @Override
    public CacheView<UserDMChannel> dmChannels() {
        return new CompositeCacheView<>(dmChannelCache.values());
    }
}

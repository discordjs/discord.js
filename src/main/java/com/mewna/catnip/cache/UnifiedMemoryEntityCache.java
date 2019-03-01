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

import com.mewna.catnip.cache.view.CacheView;
import com.mewna.catnip.cache.view.MutableCacheView;
import com.mewna.catnip.cache.view.MutableNamedCacheView;
import com.mewna.catnip.cache.view.NamedCacheView;
import com.mewna.catnip.entity.channel.UserDMChannel;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.entity.user.User;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class UnifiedMemoryEntityCache extends MemoryEntityCache {
    @SuppressWarnings("WeakerAccess")
    protected final MutableNamedCacheView<User> userCache = createUserCacheView();
    @SuppressWarnings("WeakerAccess")
    protected final MutableCacheView<UserDMChannel> dmChannelCache = createDMChannelCacheView();
    @SuppressWarnings("WeakerAccess")
    protected final MutableCacheView<Presence> presenceCache = createPresenceCacheView();
    
    @Override
    protected MutableNamedCacheView<User> userCache(final int shardId) {
        return userCache;
    }
    
    @Override
    protected MutableCacheView<UserDMChannel> dmChannelCache(final int shardId) {
        return dmChannelCache;
    }
    
    @Override
    protected MutableCacheView<Presence> presenceCache(final int shardId) {
        return presenceCache;
    }
    
    @Nullable
    @Override
    public User user(final long id) {
        return userCache.getById(id);
    }
    
    @Nonnull
    @Override
    public NamedCacheView<User> users() {
        return userCache;
    }
    
    @Nullable
    @Override
    public Presence presence(final long id) {
        return presenceCache.getById(id);
    }
    
    @Nonnull
    @Override
    public CacheView<Presence> presences() {
        return presenceCache;
    }
    
    @Nullable
    @Override
    public UserDMChannel dmChannel(final long id) {
        return dmChannelCache.getById(id);
    }
    
    @Nonnull
    @Override
    public CacheView<UserDMChannel> dmChannels() {
        return dmChannelCache;
    }
}

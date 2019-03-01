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

package com.mewna.catnip.shard.ratelimit;

import lombok.AllArgsConstructor;
import org.apache.commons.lang3.tuple.ImmutablePair;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author amy
 * @since 8/16/18.
 */
public final class MemoryRatelimiter implements Ratelimiter {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    
    static ImmutablePair<Boolean, Long> checkRatelimitInternal(final Map<String, Bucket> buckets, final String id,
                                                               final long period, final long limit) {
        final long now = System.currentTimeMillis();
        if(buckets.containsKey(id)) {
            final Bucket bucket = buckets.get(id);
            if(bucket.resetAt < now) { // handle reset
                bucket.remaining = bucket.limit; //TODO(shred): assert bucket.limit == limit for safety/sanity?
                bucket.resetAt = now + period;
            } else if(bucket.remaining <= 0) { //no permits available
                return ImmutablePair.of(true, 0L);
            }
            bucket.remaining--;
            return ImmutablePair.of(false, bucket.remaining);
        } else {
            buckets.put(id, new Bucket(limit, limit - 1, now + period));
            return ImmutablePair.of(false, limit - 1);
        }
    }
    
    @Override
    public ImmutablePair<Boolean, Long> checkRatelimit(final String id, final long periodMs, final long limit) {
        return checkRatelimitInternal(buckets, id, periodMs, limit);
    }
    
    @AllArgsConstructor
    @SuppressWarnings("FieldMayBeFinal")
    static final class Bucket {
        private long limit;
        private long remaining;
        private long resetAt;
    }
}

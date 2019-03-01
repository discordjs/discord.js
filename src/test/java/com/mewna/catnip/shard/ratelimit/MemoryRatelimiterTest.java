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

import com.mewna.catnip.shard.ratelimit.MemoryRatelimiter.Bucket;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * @author amy
 * @since 8/16/18.
 */
@SuppressWarnings("WeakerAccess")
public class MemoryRatelimiterTest {
    @Test
    public void testCheckRatelimitInternalWithBucket() {
        final Map<String, Bucket> test = new HashMap<>();
        
        final String key = "test";
        final long limit = 10;
        final long period = 500L;

        test.put(key, new Bucket(limit, limit, System.currentTimeMillis() + period));
        for(int i = 0; i < limit; i++) {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(false, res.left);
            assertEquals(limit - (i + 1), res.right.longValue());
        }
        try {
            Thread.sleep(period / 2);
        } catch(final InterruptedException e) {
            e.printStackTrace();
        }
        {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(true, res.left);
            assertEquals(0L, res.right.longValue());
        }
        try {
            Thread.sleep(period);
        } catch(final InterruptedException e) {
            e.printStackTrace();
        }
        {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(false, res.left);
            assertEquals(limit - 1, res.right.longValue());
        }
    }
    
    @Test
    public void testCheckRatelimitInternalWithoutBucket() {
        final Map<String, Bucket> test = new HashMap<>();
        
        final String key = "test";
        final long limit = 10;
        final long period = 500L;
        
        for(int i = 0; i < limit; i++) {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(false, res.left);
            assertEquals(limit - (i + 1), res.right.longValue());
        }
        try {
            Thread.sleep(period / 2);
        } catch(final InterruptedException e) {
            e.printStackTrace();
        }
        {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(true, res.left);
            assertEquals(0L, res.right.longValue());
        }
        try {
            Thread.sleep(period);
        } catch(final InterruptedException e) {
            e.printStackTrace();
        }
        {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(false, res.left);
            assertEquals(limit - 1, res.right.longValue());
        }
    }

    @Test
    public void testLateResetAt() {
        final Map<String, Bucket> test = new HashMap<>();

        final String key = "test";
        final long limit = 10;
        final long period = 500L;

        test.put(key, new Bucket(limit, limit, 1337));//NOTE(shred): old code moved from resetAt one period's worth
        for(int i = 0; i < limit; i++) {
            final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
            assertEquals(false, res.left);
        }
        final ImmutablePair<Boolean, Long> res = MemoryRatelimiter.checkRatelimitInternal(test, key, period, limit);
        assertEquals(true, res.left);
    }
}

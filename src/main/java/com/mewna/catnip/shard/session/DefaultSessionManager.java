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

package com.mewna.catnip.shard.session;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author amy
 * @since 8/16/18.
 */
public class DefaultSessionManager implements SessionManager {
    private final Map<Integer, String> sessions = new ConcurrentHashMap<>();
    private final Map<Integer, Integer> seqnums = new ConcurrentHashMap<>();
    
    @Override
    public void session(@Nonnegative final int shardId, @Nonnull final String session) {
        sessions.put(shardId, session);
    }
    
    @Override
    @Nullable
    public String session(@Nonnegative final int shardId) {
        return sessions.get(shardId);
    }
    
    @Override
    public void seqnum(@Nonnegative final int shardId, final int seqnum) {
        seqnums.put(shardId, seqnum);
    }
    
    @Override
    public int seqnum(@Nonnegative final int shardId) {
        if(!seqnums.containsKey(shardId)) {
            seqnums.put(shardId, 0);
        }
        return seqnums.get(shardId);
    }
    
    @Override
    public void clearSession(@Nonnegative final int shardId) {
        sessions.remove(shardId);
    }
    
    @Override
    public void clearSeqnum(@Nonnegative final int shardId) {
        seqnums.remove(shardId);
    }
}

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

package com.mewna.catnip.shard.manager;

import com.mewna.catnip.shard.ShardConnectState;

import javax.annotation.Nonnull;
import java.util.concurrent.CompletableFuture;

/**
 * A shard condition is an async function that determines whether or not the
 * current shard manager instance can start sharding, ie. all shard conditions
 * must be {@code true} for the shard manager to start shards.
 *
 * @author amy
 * @since 11/14/18.
 */
@SuppressWarnings("WeakerAccess")
public interface ShardCondition {
    /**
     * Get the future for this shard condition. This function is called
     * ASYNCHRONOUSLY and must be ASYNCHRONOUS to avoid blocking the vert.x
     * event loop threads.
     * <p>
     * This is run prior to sharding.
     *
     * @return The future for this shard condition.
     */
    CompletableFuture<Boolean> preshard();
    
    /**
     * Run once sharding has finished. This function is called SYNCHRONOUSLY.
     *
     * @param state The state the shard connected with
     */
    void postshard(@Nonnull ShardConnectState state);
}

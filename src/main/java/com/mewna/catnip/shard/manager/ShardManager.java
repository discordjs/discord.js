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

import com.mewna.catnip.Catnip;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletionStage;

/**
 * Manages the lifecycle of shards - starting, stopping, resuming, etc.
 *
 * @author amy
 * @since 8/15/18.
 */
public interface ShardManager {
    /**
     * @return The number of shards this shard manager owns.
     */
    @Nonnegative
    int shardCount();
    
    /**
     * @return The collection of shard ids owned by this shard manager
     * instance.
     */
    Collection<Integer> shardIds();
    
    /**
     * Starts booting shards.
     */
    void start();
    
    /**
     * @return The shard conditions for this shard manager instance.
     *
     * @see ShardCondition
     */
    List<ShardCondition> conditions();
    
    /**
     * Add a condition to this shard manager.
     *
     * @param condition The new condition.
     *
     * @return Itself.
     */
    ShardManager addCondition(@Nonnull ShardCondition condition);
    
    /**
     * Adds the given shard id to the connect queue.
     *
     * @param shard The shard id to add.
     */
    void addToConnectQueue(@Nonnegative int shard);
    
    /**
     * Fetches the trace from the given shard.
     *
     * @param shard The shard to fetch the trace from.
     *
     * @return The shard's trace.
     */
    @Nonnull
    CompletionStage<List<String>> trace(@Nonnegative int shard);
    
    /**
     * Return the shard's computed gateway latency, ie. the time it takes for
     * the shard to send a heartbeat to Discord and get a response.
     *
     * @param shard The shard ID to get gateway latency for.
     *
     * @return The shard's computed gateway latency.
     */
    @Nonnull
    CompletionStage<Long> latency(@Nonnegative int shard);
    
    /**
     * Checks whether or not the shard with the given ID is currently connected
     * to the websocket gateway. This is done as a boolean because - at least
     * for now - there's only 2 meaningful states: connected, and queued to be
     * connected.
     * <p>
     * If the shard id does <strong>not</strong> exist (ex. not controlled by
     * this shard manager instance), then the future will FAIL, and this case
     * must also be handled.
     * <p>
     * This is fetched <em>asynchronously</em>.
     *
     * @param id The id of the shard to get connection status for.
     *
     * @return Whether or not the shard with the given id is currently
     * connected to the websocket gateway.
     */
    @Nonnull
    @CheckReturnValue
    CompletionStage<Boolean> isConnected(@Nonnegative int id);
    
    /**
     * @return The catnip instance this shard manager is for.
     */
    @Nonnull
    Catnip catnip();
    
    @SuppressWarnings("UnusedReturnValue")
    @Nonnull
    ShardManager catnip(@Nonnull Catnip catnip);
    
    /**
     * Shuts down all shards.
     */
    void shutdown();
}

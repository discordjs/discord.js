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
import com.mewna.catnip.shard.ShardControlMessage;
import com.mewna.catnip.util.JsonUtil;
import com.mewna.catnip.util.SafeVertxCompletableFuture;
import io.vertx.core.json.JsonArray;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CopyOnWriteArrayList;

import static com.mewna.catnip.shard.ShardAddress.CONTROL;
import static com.mewna.catnip.shard.ShardAddress.computeAddress;

/**
 * @author amy
 * @since 11/13/18.
 */
@Accessors(fluent = true)
@SuppressWarnings("unused")
@RequiredArgsConstructor
public abstract class AbstractShardManager implements ShardManager {
    @Getter
    private final List<ShardCondition> conditions = new CopyOnWriteArrayList<>();
    @Getter
    @Setter
    private Catnip catnip;

    @Override
    public ShardManager addCondition(@Nonnull final ShardCondition condition) {
        conditions.add(condition);
        return this;
    }
    
    @Nonnull
    @Override
    public CompletionStage<List<String>> trace(@Nonnegative final int shard) {
        final CompletableFuture<List<String>> future = new SafeVertxCompletableFuture<>(catnip);
        catnip.eventBus().<JsonArray>send(computeAddress(CONTROL, shard), ShardControlMessage.TRACE,
                reply -> {
                    if(reply.succeeded()) {
                        // ow
                        future.complete(JsonUtil.toStringList(reply.result().body()));
                    } else {
                        future.completeExceptionally(reply.cause());
                    }
                });
        return future;
    }
    
    @Nonnull
    @Override
    public CompletionStage<Long> latency(final int shard) {
        final CompletableFuture<Long> future = new SafeVertxCompletableFuture<>(catnip);
        catnip.eventBus().<Long>send(computeAddress(CONTROL, shard), ShardControlMessage.LATENCY,
                reply -> {
                    if(reply.succeeded()) {
                        // ow
                        future.complete(reply.result().body());
                    } else {
                        future.completeExceptionally(reply.cause());
                    }
                });
        return future;
    }
    
    @Nonnull
    @Override
    @CheckReturnValue
    public CompletionStage<Boolean> isConnected(@Nonnegative final int id) {
        final CompletableFuture<Boolean> future = new SafeVertxCompletableFuture<>(catnip);
        catnip.eventBus().<Boolean>send(computeAddress(CONTROL, id), ShardControlMessage.CONNECTED,
                reply -> {
                    if(reply.succeeded()) {
                        future.complete(reply.result().body());
                    } else {
                        future.completeExceptionally(reply.cause());
                    }
                });
        return future;
    }
}

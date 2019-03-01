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

import com.google.common.collect.ImmutableList;
import com.mewna.catnip.shard.CatnipShard;
import com.mewna.catnip.shard.LifecycleEvent.Raw;
import com.mewna.catnip.shard.ShardConnectState;
import com.mewna.catnip.shard.ShardInfo;
import com.mewna.catnip.util.SafeVertxCompletableFuture;
import com.mewna.catnip.util.task.QueueTask;
import com.mewna.catnip.util.task.ShardConnectTask;
import io.vertx.core.eventbus.MessageConsumer;
import lombok.Getter;
import lombok.experimental.Accessors;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.mewna.catnip.shard.ShardAddress.CONTROL;
import static com.mewna.catnip.shard.ShardAddress.computeAddress;
import static com.mewna.catnip.shard.ShardControlMessage.CONNECT;

/**
 * @author amy
 * @since 8/15/18.
 */
@Accessors(fluent = true)
public class DefaultShardManager extends AbstractShardManager {
    @Getter
    private final QueueTask<Integer> connectQueue = new ShardConnectTask(this::startShard);
    private final Collection<MessageConsumer> consumers = new HashSet<>();
    private final Map<Integer, String> shards = new ConcurrentHashMap<>();
    private final Collection<Integer> shardIds;
    @Getter
    private int shardCount;
    
    public DefaultShardManager() {
        this(0, new ArrayList<>());
    }
    
    public DefaultShardManager(@Nonnegative final int customShardCount) {
        this(IntStream.range(0, customShardCount));
    }
    
    public DefaultShardManager(final IntStream shardIds) {
        this(shardIds.boxed().collect(Collectors.toList()));
    }
    
    public DefaultShardManager(final Iterable<Integer> shardIds) {
        this(iterableLength(shardIds), iterableToCollection(shardIds));
    }
    
    public DefaultShardManager(@Nonnegative final int shardCount, final Collection<Integer> shardIds) {
        this.shardCount = shardCount;
        this.shardIds = new ArrayList<>(shardIds);
    }
    
    private static <T> int iterableLength(@Nonnull final Iterable<T> iterable) {
        int count = 0;
        for(final T ignored : iterable) {
            ++count;
        }
        return count;
    }
    
    private static <T> Collection<T> iterableToCollection(@Nonnull final Iterable<T> iterable) {
        final List<T> list = new ArrayList<>();
        iterable.forEach(list::add);
        return list;
    }
    
    @Override
    public Collection<Integer> shardIds() {
        return ImmutableList.copyOf(shardIds);
    }
    
    @Override
    public void start() {
        consumers.add(catnip().eventBus().<ShardInfo>consumer(Raw.CLOSED, closeHandler -> {
            catnip().logAdapter().info("Shard {} closed, re-queuing...", closeHandler.body().getId());
            addToConnectQueue(closeHandler.body().getId());
        }));
        
        if(shardCount == 0) {
            // Load shard count from API
            catnip().rest().user().getGatewayBot().thenAccept(gatewayInfo -> {
                shardCount = gatewayInfo.shards();
                catnip().logAdapter().info("Loaded expected shard count: {}", shardCount);
                shardIds.clear();
                shardIds.addAll(IntStream.range(0, shardCount).boxed().collect(Collectors.toList()));
                loadShards();
            }).exceptionally(e -> {
                throw new IllegalStateException("Couldn't load shard count from API!", e);
            });
        } else {
            loadShards();
        }
    }
    
    private void loadShards() {
        catnip().logAdapter().info("Booting {}(/{}) shards", shardIds.size(), shardCount);
        shardIds.forEach(connectQueue::offer);
    }
    
    private void startShard(final int id) {
        SafeVertxCompletableFuture.allOf(conditions().stream().map(ShardCondition::preshard).toArray(CompletableFuture[]::new))
                .thenAccept(t -> {
                    undeploy(id);
                    catnip().logAdapter().info("Connecting shard {} (queue len {})", id, connectQueue.size());
                    
                    catnip().vertx().deployVerticle(new CatnipShard(catnip(), id, shardCount, catnip().initialPresence()), deployResult -> {
                        if(deployResult.failed()) {
                            catnip().logAdapter().error("Deploying shard {} failed, re-queueing!", id, deployResult.cause());
                            addToConnectQueue(id);
                            connectQueue.run();
                            return;
                        }
                        shards.put(id, deployResult.result());
                        catnip().logAdapter().info("Deployed shard {}(/{})", id, shardCount);
                        connectShard(id);
                    });
                })
                .exceptionally(e -> {
                    catnip().logAdapter().debug("Couldn't complete shard conditions, trying again in 1s", e);
                    catnip().vertx().setTimer(1000L, t -> startShard(id));
                    return null;
                });
    }
    
    private void undeploy(final int id) {
        final String deployment = shards.remove(id);
        if(deployment != null) {
            catnip().vertx().undeploy(deployment);
        }
    }
    
    private void connectShard(final int id) {
        final String deploymentId = shards.get(id);
        
        if(deploymentId == null) {
            catnip().logAdapter().error("Cannot find deployment ID of shard {}, re-queueing...", id);
            addToConnectQueue(id);
            connectQueue.run();
            return;
        }
        
        catnip().eventBus().<ShardConnectState>send(computeAddress(CONTROL, id), CONNECT, result -> {
            // ignore the reply if deployment ID differs.
            if(!deploymentId.equals(shards.get(id))) {
                return;
            }
            
            if(result.failed()) {
                catnip().logAdapter().error("Something went really wrong while trying to connect shard {}, re-queueing...", id, result.cause());
                addToConnectQueue(id);
                connectQueue.run();
                return;
            }
            
            final ShardConnectState state = result.result().body();
            switch(state) {
                case READY:
                    catnip().logAdapter().info("Connected shard {}(/{})", id, shardCount);
                    catnip().vertx().setTimer(5500, t -> connectQueue.run());
                    break;
                case RESUMED:
                    catnip().logAdapter().info("Resumed shard {}(/{})", id, shardCount);
                    connectQueue.run();
                    break;
                case FAILED:
                    catnip().logAdapter().error("Failed connecting shard {}(/{}), re-queueing...", id, shardCount);
                    addToConnectQueue(id);
                    connectQueue.run();
                    break;
                default:
                    catnip().logAdapter().error("This shouldn't happen, but we got unknown state for shard {}: {}", id, state);
                    connectQueue.run();
                    break;
            }
            conditions().forEach(e -> e.postshard(state));
        });
    }
    
    @Override
    public void addToConnectQueue(@Nonnegative final int shard) {
        if(!connectQueue.offer(shard)) {
            catnip().logAdapter().warn("Ignoring duplicate queue for shard {}", shard);
        }
    }
    
    @Override
    public void shutdown() {
        consumers.forEach(MessageConsumer::unregister);
        consumers.clear();
        shards.values().forEach(shard -> catnip().vertx().undeploy(shard));
        shards.clear();
    }
}

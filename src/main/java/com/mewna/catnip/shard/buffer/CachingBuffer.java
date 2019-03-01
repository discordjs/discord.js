/*
 * Copyright (c) 2019 amy, All rights reserved.
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

package com.mewna.catnip.shard.buffer;

import com.google.common.collect.ImmutableSet;
import com.mewna.catnip.shard.CatnipShard;
import com.mewna.catnip.shard.GatewayOp;
import com.mewna.catnip.util.JsonUtil;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Value;
import lombok.experimental.Accessors;

import java.util.Deque;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

import static com.mewna.catnip.shard.CatnipShard.LARGE_THRESHOLD;
import static com.mewna.catnip.shard.DiscordEvent.Raw;
import static com.mewna.catnip.shard.ShardAddress.WEBSOCKET_QUEUE;
import static com.mewna.catnip.shard.ShardAddress.computeAddress;

/**
 * An implementation of {@link EventBuffer} used for the case of caching all
 * guilds sent in the {@code READY} payload, as well as for caching data as it
 * comes over the websocket connection.
 *
 * @author amy
 * @since 9/9/18.
 */
@SuppressWarnings("unused")
public class CachingBuffer extends AbstractBuffer {
    private static final Set<String> CACHE_EVENTS = ImmutableSet.of(
            // Lifecycle
            Raw.READY,
            // Channels
            Raw.CHANNEL_CREATE, Raw.CHANNEL_UPDATE, Raw.CHANNEL_DELETE,
            // Guilds
            Raw.GUILD_CREATE, Raw.GUILD_UPDATE, Raw.GUILD_DELETE,
            // Roles
            Raw.GUILD_ROLE_CREATE, Raw.GUILD_ROLE_UPDATE, Raw.GUILD_ROLE_DELETE,
            // Emoji
            Raw.GUILD_EMOJIS_UPDATE,
            // Members
            Raw.GUILD_MEMBER_ADD, Raw.GUILD_MEMBER_REMOVE, Raw.GUILD_MEMBER_UPDATE,
            // Member chunking
            Raw.GUILD_MEMBERS_CHUNK,
            // Users
            Raw.USER_UPDATE, Raw.PRESENCE_UPDATE,
            // Voice
            Raw.VOICE_STATE_UPDATE
    );
    
    private static final Set<String> DELETE_EVENTS = ImmutableSet.of(
            // Channels
            Raw.CHANNEL_DELETE,
            // Guilds
            Raw.GUILD_DELETE,
            // Roles
            Raw.GUILD_ROLE_DELETE,
            // Members
            Raw.GUILD_MEMBER_REMOVE
    );
    
    private final Map<Integer, BufferState> buffers = new ConcurrentHashMap<>();
    
    @Override
    public void buffer(final JsonObject event) {
        final JsonObject shardData = event.getJsonObject("shard");
        final int id = shardData.getInteger("id");
        final String type = event.getString("t");
        
        final JsonObject d = event.getJsonObject("d");
        final BufferState bufferState = buffers.get(id);
        switch(type) {
            case Raw.READY: {
                handleReady(id, event);
                // In theory, we shouldn't need `bufferState != null` checks
                // beyond this point. The default vert.x event bus is
                // single-threaded, and #handleReady will already insert a
                // BufferState into the mappings for us.
                break;
            }
            case Raw.GUILD_CREATE: {
                handleGuildCreate(bufferState, event);
                break;
            }
            case Raw.GUILD_MEMBERS_CHUNK: {
                handleGuildMemberChunk(bufferState, event);
                // We very explicitly DON'T break here because this is SUPPOSED to fall through to the next case
            }
            default: {
                // Buffer and replay later
                handleEvent(id, bufferState, event);
                break;
            }
        }
    }
    
    private void handleReady(final int shardId, final JsonObject event) {
        final JsonObject payloadData = event.getJsonObject("d");
        final String eventType = event.getString("t");
        final Set<String> guilds = JsonUtil.toMutableSet(payloadData.getJsonArray("guilds"), g -> g.getString("id"));
        buffers.put(shardId, new BufferState(shardId, guilds));
        catnip().logAdapter().debug("Prepared new BufferState for shard {} with {} guilds.", shardId, guilds.size());
        // READY is also a cache event, as it does come with
        // information about the current user
        maybeCache(eventType, shardId, payloadData).setHandler(_res -> emitter().emit(event));
    }
    
    private void handleGuildCreate(final BufferState bufferState, final JsonObject event) {
        final int shardId = bufferState.id();
        final JsonObject payloadData = event.getJsonObject("d");
        final String guild = payloadData.getString("id");
        // Make sure to cache guild
        // This will always succeed unless something goes horribly wrong
        maybeCache(Raw.GUILD_CREATE, shardId, payloadData).setHandler(_res -> {
            // Trigger member chunking
            final Integer memberCount = payloadData.getInteger("member_count");
            if(catnip().chunkMembers() //only send the request if needed
                    && memberCount > LARGE_THRESHOLD) {
                // Chunk members
                catnip().eventBus().publish(computeAddress(WEBSOCKET_QUEUE, shardId),
                        CatnipShard.basePayload(GatewayOp.REQUEST_GUILD_MEMBERS,
                                new JsonObject()
                                        .put("guild_id", guild)
                                        .put("query", "")
                                        .put("limit", 0)
                        ));
            }
            // Add the guild to be awaited so that we can buffer members
            bufferState.awaitGuild(guild);
            
            // Remove READY guild if necessary, otherwise buffer
            if(bufferState.awaitedGuilds().contains(guild)) {
                if(catnip().chunkMembers() && memberCount > LARGE_THRESHOLD) {
                    // If we're chunking members, calculate how many chunks we have to await
                    int chunks = memberCount / 1000;
                    if(memberCount % 1000 != 0) {
                        // Not a perfect 1k, add a chunk to make up for how math works
                        chunks += 1;
                    }
                    bufferState.initialGuildChunkCount(guild, chunks, event);
                } else {
                    emitter().emit(event);
                    bufferState.receiveGuild(guild);
                    bufferState.replayGuild(guild);
                    // Replay all buffered events once we run out
                    if(bufferState.awaitedGuilds().isEmpty()) {
                        bufferState.replay();
                    }
                }
            } else {
                bufferState.buffer(event);
            }
        });
    }
    
    private void handleGuildMemberChunk(final BufferState bufferState, final JsonObject event) {
        final JsonObject payloadData = event.getJsonObject("d");
        final String eventType = event.getString("t");
        
        if(catnip().chunkMembers()) {
            final String guild = payloadData.getString("guild_id");
            cacheAndDispatch(eventType, payloadData, bufferState.id(), event);
            bufferState.acceptChunk(guild);
            if(bufferState.doneChunking(guild)) {
                emitter().emit(bufferState.guildCreate(guild));
                // If we're finished chunking that guild, defer doing everything needed
                // by a little bit to allow chunk caching to finish
                bufferState.receiveGuild(guild);
                bufferState.replayGuild(guild);
                // Replay all buffered events once we run out
                if(bufferState.awaitedGuilds().isEmpty()) {
                    bufferState.replay();
                }
            }
        }
    }
    
    private void handleEvent(final int id, final BufferState bufferState, final JsonObject event) {
        final JsonObject payloadData = event.getJsonObject("d");
        final String eventType = event.getString("t");
        
        final String guildId = payloadData.getString("guild_id", null);
        if(guildId != null) {
            if(bufferState.awaitedGuilds().contains(guildId)) {
                // If we have a guild id, and we have a guild being awaited,
                // buffer the event
                bufferState.receiveGuildEvent(guildId, event);
            } else {
                // If we're not awaiting the guild, it means that we're done
                // buffering events for the guild - ie. all member chunks have
                // been received - and so we can emit
                cacheAndDispatch(eventType, payloadData, id, event);
            }
        } else {
            // Emit if the payload has no guild id
            cacheAndDispatch(eventType, payloadData, id, event);
        }
    }
    
    // Yeah just lazy af here I know, but no need to fetch data a second time
    private void cacheAndDispatch(final String type, final JsonObject d, final int id, final JsonObject event) {
        if(DELETE_EVENTS.contains(type)) {
            // We want to update cache AFTER we dispatch the event to
            // subconsumers, to avoid a race around cache accesses.
            // When explicitly only using the internal event bus, handlers are
            // just invoked in a synchronous loop (see EventBusImpl in v.x),
            // which means that this is safe:tm: to do here.
            emitter().emit(event);
            maybeCache(type, id, d);
        } else {
            maybeCache(type, id, d).setHandler(_res -> emitter().emit(event));
        }
    }
    
    private Future<Void> maybeCache(final String eventType, final int shardId, final JsonObject data) {
        if(CACHE_EVENTS.contains(eventType)) {
            try {
                return catnip().cacheWorker().updateCache(eventType, shardId, data);
            } catch(final Exception e) {
                catnip().logAdapter().warn("Got error updating cache for payload {}", eventType, e);
                catnip().logAdapter().warn("Payload: {}", data.encodePrettily());
                return Future.failedFuture(e);
            }
        } else {
            return Future.succeededFuture();
        }
    }
    
    @Value
    @Accessors(fluent = true)
    private final class BufferState {
        private int id;
        private final Set<String> awaitedGuilds;
        private final Map<String, Deque<JsonObject>> guildBuffers = new ConcurrentHashMap<>();
        private final Map<String, Counter> guildChunkCount = new ConcurrentHashMap<>();
        private final Deque<JsonObject> buffer = new ConcurrentLinkedDeque<>();
        
        void awaitGuild(final String id) {
            awaitedGuilds.add(id);
        }
        
        void receiveGuild(final String id) {
            awaitedGuilds.remove(id);
        }
        
        void receiveGuildEvent(final String id, final JsonObject event) {
            final Deque<JsonObject> queue = guildBuffers.computeIfAbsent(id, __ -> new ConcurrentLinkedDeque<>());
            queue.addLast(event);
        }
        
        void buffer(final JsonObject event) {
            buffer.addLast(event);
        }
        
        void replayGuild(final String id) {
            if(guildBuffers.containsKey(id)) {
                final Deque<JsonObject> queue = guildBuffers.get(id);
                queue.forEach(emitter()::emit);
            }
        }
        
        void replay() {
            buffer.forEach(emitter()::emit);
        }
        
        void initialGuildChunkCount(final String guild, final int count, final JsonObject guildCreate) {
            guildChunkCount.put(guild, new Counter(guildCreate, count));
        }
        
        void acceptChunk(final String guild) {
            final Counter counter = guildChunkCount.get(guild);
            counter.decrement();
        }
        
        boolean doneChunking(final String guild) {
            return guildChunkCount.get(guild).count() == 0;
        }
        
        JsonObject guildCreate(final String guild) {
            return guildChunkCount.get(guild).guildCreate();
        }
    }
    
    @Accessors(fluent = true)
    @AllArgsConstructor
    private final class Counter {
        @Getter
        private final JsonObject guildCreate;
        @Getter
        private int count;
        
        void decrement() {
            --count;
        }
    }
}

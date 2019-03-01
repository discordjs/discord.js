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

package com.mewna.catnip.shard;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.impl.PresenceImpl;
import com.mewna.catnip.entity.misc.GatewayInfo;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.extension.Extension;
import com.mewna.catnip.extension.hook.CatnipHook;
import com.mewna.catnip.shard.LifecycleEvent.Raw;
import com.mewna.catnip.shard.manager.AbstractShardManager;
import com.mewna.catnip.shard.manager.DefaultShardManager;
import com.mewna.catnip.util.BufferOutputStream;
import com.mewna.catnip.util.JsonUtil;
import com.mewna.catnip.util.task.GatewayTask;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientOptions;
import io.vertx.core.http.WebSocket;
import io.vertx.core.http.WebSocketFrame;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.zip.Inflater;
import java.util.zip.InflaterOutputStream;

import static com.mewna.catnip.shard.ShardAddress.*;

/**
 * A catnip shard encapsulates a single websocket connection to Discord's
 * real-time gateway. Shards are implemented as vert.x verticles and should be
 * un/deployed as such; see {@link DefaultShardManager} and
 * {@link AbstractShardManager} for more.
 * <p/>
 * Shards are controlled by sending messages over the vert.x event bus; it is
 * NOT recommended that you store a reference to a shard verticle anywhere. To
 * send a message to a shard:
 * <ol>
 * <li>Get the shard's control address with {@code ShardAddress.computeAddress(ShardAddress.CONTROL, id)}.</li>
 * <li>Send a {@link ShardControlMessage} to it.</li>
 * </ol>
 *
 * @author amy
 * @since 8/31/18.
 */
@SuppressWarnings({"WeakerAccess", "unused"})
public class CatnipShard extends AbstractVerticle {
    public static final int ZLIB_SUFFIX = 0x0000FFFF;
    public static final int LARGE_THRESHOLD = 250;
    
    private final Catnip catnip;
    private final int id;
    private final int limit;
    private final Presence presence;
    
    private final HttpClient client;
    
    private final Collection<MessageConsumer> consumers = new HashSet<>();
    
    // This is an AtomicLong instead of a volatile long because IntelliJ got
    // A N G E R Y because I guess longs don't get written atomically.
    private final AtomicLong heartbeatTask = new AtomicLong(-1L);
    private final Buffer readBuffer = Buffer.buffer();
    private final Buffer decompressBuffer = Buffer.buffer();
    private final byte[] decompress = new byte[1024];
    // aka memory golfing
    private final String control;
    private final String websocketQueue;
    private final String websocketSend;
    private final String presenceUpdateRequest;
    private final String voiceStateUpdateQueue;
    private final GatewayTask<JsonObject> sendTask;
    private final GatewayTask<PresenceImpl> presenceTask;
    private volatile Presence currentPresence;
    private volatile boolean heartbeatAcked = true;
    private volatile long lastHeartbeat = -1; //use System.nanoTime() as that is monotonic
    private volatile long lastHeartbeatLatency = -1;
    private volatile boolean presenceRateLimitRecheckQueued;
    private volatile boolean sendRateLimitRecheckQueued;
    private volatile List<String> trace = Collections.emptyList();
    private volatile boolean connected;
    private volatile boolean socketOpen;
    private volatile boolean closedByClient;
    private WebSocket socket;
    private Inflater inflater;
    private int readBufferPosition;
    private Message<ShardControlMessage> message;
    
    public CatnipShard(@Nonnull final Catnip catnip, @Nonnegative final int id, @Nonnegative final int limit,
                       @Nullable final Presence presence) {
        this.catnip = catnip;
        this.id = id;
        this.limit = limit;
        this.presence = presence;
        
        client = catnip.vertx().createHttpClient(new HttpClientOptions()
                .setMaxWebsocketFrameSize(Integer.MAX_VALUE)
                .setMaxWebsocketMessageSize(Integer.MAX_VALUE));
        
        control = computeAddress(CONTROL, id);
        websocketQueue = computeAddress(WEBSOCKET_QUEUE, id);
        websocketSend = computeAddress(WEBSOCKET_SEND, id);
        presenceUpdateRequest = computeAddress(PRESENCE_UPDATE_REQUEST, id);
        voiceStateUpdateQueue = computeAddress(VOICE_STATE_UPDATE_QUEUE, id);
        
        sendTask = GatewayTask.gatewaySendTask(catnip, "catnip:gateway:" + id + ":outgoing-send",
                object -> catnip.eventBus().publish(websocketSend, object));
        presenceTask = GatewayTask.gatewayPresenceTask(catnip, presenceUpdateRequest, update -> {
            catnip.eventBus().publish(websocketSend,
                    basePayload(GatewayOp.STATUS_UPDATE, update.asJson()));
            currentPresence = update;
        });
    }
    
    public static JsonObject basePayload(@Nonnull final GatewayOp op) {
        return basePayload(op, (JsonObject) null);
    }
    
    public static JsonObject basePayload(@Nonnull final GatewayOp op, @Nullable final JsonObject payload) {
        return new JsonObject()
                .put("op", op.opcode())
                .put("d", payload);
    }
    
    public static JsonObject basePayload(@Nonnull final GatewayOp op, @Nonnull @Nonnegative final Integer payload) {
        return new JsonObject()
                .put("op", op.opcode())
                .put("d", payload);
    }
    
    @Override
    public void start() {
        final EventBus eventBus = catnip.eventBus();
        Collections.addAll(consumers,
                eventBus.consumer(control, this::handleControlMessage),
                eventBus.consumer(websocketQueue, this::handleSocketQueue),
                eventBus.consumer(websocketSend, this::handleSocketSend),
                eventBus.consumer(presenceUpdateRequest, this::handlePresenceUpdate),
                eventBus.consumer(voiceStateUpdateQueue, this::handleVoiceStateUpdateQueue)
        );
    }
    
    @Override
    public void stop() {
        consumers.forEach(MessageConsumer::unregister);
        consumers.clear();
        
        if(socket != null) {
            closedByClient = true;
            if(socketOpen) {
                socket.close((short) 4000);
            }
            socketOpen = false;
        }
        heartbeatAcked = true;
        
        catnip.vertx().cancelTimer(heartbeatTask.get());
    }
    
    private void handleVoiceStateUpdateQueue(final Message<JsonObject> message) {
        sendTask.offer(basePayload(GatewayOp.VOICE_STATE_UPDATE, message.body()));
    }
    
    private void handlePresenceUpdate(final Message<PresenceImpl> message) {
        final PresenceImpl impl = message.body();
        if(impl == null) {
            message.reply(currentPresence);
            return;
        }
        presenceTask.offer(impl);
    }
    
    private void handleControlMessage(final Message<ShardControlMessage> msg) {
        final ShardControlMessage body = msg.body();
        switch(body) {
            case TRACE:
                msg.reply(new JsonArray(trace));
                break;
            case CONNECTED:
                msg.reply(socket != null && socketOpen);
                break;
            case LATENCY:
                msg.reply(lastHeartbeatLatency);
                break;
            case CONNECT:
                if(connected) {
                    msg.fail(1000, "Cannot connect shard twice, redeploy it.");
                    return;
                }
                connected = true;
                message = msg;
                connectSocket();
                break;
            default:
                catnip.logAdapter().warn("Shard {}/{}: Got unknown control message: {}", id, limit, body.name());
                break;
        }
    }
    
    private void connectSocket() {
        catnip.eventBus().publish(Raw.CONNECTING, shardInfo());
        
        final GatewayInfo info = catnip.gatewayInfo();
        if(info != null) {
            connectSocket(info.url());
        } else {
            catnip.fetchGatewayInfo().thenAccept(i -> connectSocket(i.url()));
        }
    }
    
    private void stateReply(@Nonnull final ShardConnectState state) {
        if(message != null) {
            message.reply(state);
            message = null;
        }
    }
    
    @SuppressWarnings("squid:HiddenFieldCheck")
    private void connectSocket(final String url) {
        client.websocketAbs(url, null, null, null,
                socket -> {
                    this.socket = socket;
                    socketOpen = true;
                    
                    catnip.eventBus().publish(Raw.CONNECTED, shardInfo());
                    socket.frameHandler(this::handleSocketFrame)
                            .closeHandler(this::handleSocketClose)
                            .exceptionHandler(t -> {
                                socketOpen = false;
                                catnip.logAdapter().error("Shard {}/{}: Exception in Websocket", id, limit, t);
                            })
                            .endHandler(end -> socketOpen = false);
                },
                failure -> {
                    socket = null;
                    socketOpen = false;
                    catnip.logAdapter().error("Shard {}/{}: Couldn't connect socket:", id, limit, failure);
                    catnip.eventBus().publish(Raw.CLOSED, shardInfo());
                    stateReply(ShardConnectState.FAILED);
                });
    }
    
    private void handleBinaryData(final Buffer binary) {
        if(socket == null) {
            return;
        }
        final boolean isEnd = binary.getInt(binary.length() - 4) == ZLIB_SUFFIX;
        if(!isEnd || readBufferPosition > 0) {
            final int position = readBufferPosition;
            readBuffer.setBuffer(position, binary);
            readBufferPosition = position + binary.length();
        }
        if(isEnd) {
            final Buffer decompressed = decompressBuffer;
            final Buffer dataToDecompress = readBufferPosition > 0 ? readBuffer : binary;
            try(final InflaterOutputStream ios = new InflaterOutputStream(new BufferOutputStream(decompressed, 0), inflater)) {
                synchronized(decompressBuffer) {
                    final int length = Math.max(readBufferPosition, binary.length());
                    int r = 0;
                    while(r < length) {
                        // How many bytes we can read
                        final int read = Math.min(decompress.length, length - r);
                        dataToDecompress.getBytes(r, r + read, decompress);
                        // Decompress
                        ios.write(decompress, 0, read);
                        r += read;
                    }
                }
                handleSocketData(decompressed.toJsonObject());
            } catch(final IOException e) {
                catnip.logAdapter().error("Shard {}/{}: Error decompressing payload", id, limit, e);
            } finally {
                readBufferPosition = 0;
            }
        }
    }
    
    private void handleSocketFrame(final WebSocketFrame frame) {
        try {
            if(frame.isText()) {
                handleSocketData(new JsonObject(frame.textData()));
            }
            if(frame.isBinary()) {
                handleBinaryData(frame.binaryData());
            }
            if(frame.isClose()) {
                handleSocketCloseFrame(frame);
            }
        } catch(final Exception e) {
            catnip.logAdapter().error("Shard {}/{}: Failed to handle socket frame", id, limit, e);
        }
    }
    
    private void handleSocketData(JsonObject payload) {
        for(final Extension extension : catnip.extensionManager().extensions()) {
            for(final CatnipHook hook : extension.hooks()) {
                payload = hook.rawGatewayReceiveHook(payload);
            }
        }
        
        final GatewayOp op = GatewayOp.byId(payload.getInteger("op"));
        // We pass `msg` for consistency (and for the off-chance it's
        // needed), but REALLY you don't wanna do anything with it. It
        // gets passed *entirely* so that we can reply to the shard
        // manager directly.
        switch(op) {
            case HELLO:
                handleHello(payload);
                break;
            case DISPATCH:
                handleDispatch(payload);
                break;
            case HEARTBEAT:
                handleHeartbeat();
                break;
            case HEARTBEAT_ACK:
                handleHeartbeatAck();
                break;
            case INVALID_SESSION:
                handleInvalidSession(payload);
                break;
            case RECONNECT:
                handleReconnectRequest();
                break;
            default:
                break;
        }
    }
    
    private void handleSocketCloseFrame(final WebSocketFrame frame) {
        socketOpen = false;
        final short closeCode = frame.closeStatusCode();
        if(closeCode == GatewayCloseCode.INVALID_SEQ.code() || closeCode == GatewayCloseCode.SESSION_TIMEOUT.code()) {
            // These two close codes invalidate your session (and afaik do not send an OP9).
            catnip.sessionManager().clearSeqnum(id);
            catnip.sessionManager().clearSession(id);
        }
        if(closedByClient) {
            catnip.logAdapter().info("Shard {}/{}: We closed the websocket with code {}", id, limit, closeCode);
        } else {
            if(closeCode >= 4000) {
                final GatewayCloseCode code = GatewayCloseCode.byId(closeCode);
                if(code != null) {
                    catnip.logAdapter().warn("Shard {}/{}: gateway websocket closed with code {}: {}: {}",
                            id, limit, closeCode, code.name(), code.message());
                } else {
                    catnip.logAdapter().warn("Shard {}/{}: gateway websocket closing with code {}: {}",
                            id, limit, closeCode, frame.closeReason());
                }
            } else {
                catnip.logAdapter().warn("Shard {}/{}: gateway websocket closing with code {}: {}",
                        id, limit, closeCode, frame.closeReason());
            }
        }
    }
    
    @SuppressWarnings("squid:S1172")
    private void handleSocketClose(final Void ignored) {
        final boolean cancel = vertx.cancelTimer(heartbeatTask.get());
        catnip.logAdapter().debug("Canceled timer task from socket close: {}", cancel);
        catnip.eventBus().publish(Raw.DISCONNECTED, shardInfo());
        catnip.logAdapter().warn("Shard {}/{}: Socket closing!", id, limit);
        try {
            socket = null;
            socketOpen = false;
            closedByClient = false;
            catnip.eventBus().publish(Raw.CLOSED, shardInfo());
        } catch(final Exception e) {
            catnip.logAdapter().error("Shard {}/{}: Failure closing socket:", id, limit, e);
        }
    }
    
    private void handleSocketQueue(final Message<JsonObject> msg) {
        sendTask.offer(msg.body());
    }
    
    private void handleSocketSend(final Message<JsonObject> msg) {
        if(socket != null && socketOpen) {
            JsonObject payload = msg.body();
            for(final Extension extension : catnip.extensionManager().extensions()) {
                for(final CatnipHook hook : extension.hooks()) {
                    payload = hook.rawGatewaySendHook(payload);
                }
            }
            socket.writeTextMessage(payload.encode());
        }
    }
    
    private void handleHello(final JsonObject event) {
        final JsonObject payload = event.getJsonObject("d");
        trace = JsonUtil.toStringList(payload.getJsonArray("_trace"));
        
        final long taskId = catnip.vertx().setPeriodic(payload.getInteger("heartbeat_interval"), timerId -> {
            if(socket != null && socketOpen) {
                if(!heartbeatAcked) {
                    // Zombie
                    catnip.logAdapter().warn("Shard {}/{}: Heartbeat zombie, queueing reconnect!", id, limit);
                    closedByClient = true;
                    try {
                        socket.close();
                    } catch(final IllegalStateException e) {
                        // we need to just ignore the exception, vert.x is really retarded
                    }
                    return;
                }
                catnip.eventBus().publish(websocketSend, basePayload(GatewayOp.HEARTBEAT, catnip.sessionManager().seqnum(id)));
                lastHeartbeat = System.nanoTime();
                heartbeatAcked = false;
            } else {
                final boolean cancel = catnip.vertx().cancelTimer(heartbeatTask.get());
                catnip.logAdapter().debug("Canceled timer task inside of itself: {}", cancel);
            }
        });
        heartbeatTask.set(taskId);
        
        // Check if we can RESUME instead
        if(catnip.sessionManager().session(id) != null && catnip.sessionManager().seqnum(id) > 0) {
            catnip.eventBus().publish(websocketSend, resume());
        } else {
            catnip.eventBus().publish(websocketSend, identify());
        }
    }
    
    private void handleDispatch(final JsonObject event) {
        // Should be safe to ignore
        if(event.getValue("d") instanceof JsonArray) {
            return;
        }
        final JsonObject data = event.getJsonObject("d");
        final String type = event.getString("t");
        
        // Update trace and seqnum as needed
        if(data.getJsonArray("_trace", null) != null) {
            trace = JsonUtil.toStringList(data.getJsonArray("_trace"));
        } else {
            trace = Collections.emptyList();
        }
        
        if(event.getValue("s", null) != null) {
            catnip.sessionManager().seqnum(id, event.getInteger("s"));
        }
        
        switch(type) {
            case "READY":
                catnip.sessionManager().session(id, data.getString("session_id"));
                // Reply after IDENTIFY ratelimit
                catnip.eventBus().publish(Raw.IDENTIFIED, shardInfo());
                stateReply(ShardConnectState.READY);
                break;
            case "RESUMED":
                // RESUME is fine, just reply immediately
                catnip.eventBus().publish(Raw.RESUMED, shardInfo());
                stateReply(ShardConnectState.RESUMED);
                break;
            default:
                break;
        }
        
        // This allows a buffer to know WHERE an event is coming from, so that
        // it can be accurate in the case of ex. buffering events until a shard
        // has finished booting.
        event.put("shard", new JsonObject().put("id", id).put("limit", limit));
        catnip.eventBuffer().buffer(event);
    }
    
    private void handleHeartbeat() {
        catnip.eventBus().publish(websocketSend, basePayload(GatewayOp.HEARTBEAT, catnip.sessionManager().seqnum(id)));
    }
    
    private void handleHeartbeatAck() {
        heartbeatAcked = true;
        lastHeartbeatLatency = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - lastHeartbeat);
    }
    
    private void handleInvalidSession(final JsonObject event) {
        if(!event.getBoolean("d")) {
            catnip.logAdapter().info("Session invalidated (OP 9), clearing shard data and reconnecting");
            
            catnip.cacheWorker().invalidateShard(id);
            catnip.sessionManager().clearSession(id);
            catnip.sessionManager().clearSeqnum(id);
            
            closedByClient = true;
        }
        
        if(socket != null && socketOpen) {
            socket.close();
        }
    }
    
    private void handleReconnectRequest() {
        // Just immediately disconnect
        if(socket != null) {
            closedByClient = true;
            if(socketOpen) {
                socket.close();
            }
        }
    }
    
    private JsonObject identify() {
        final JsonObject data = new JsonObject()
                .put("token", catnip.token())
                .put("compress", false)
                .put("large_threshold", LARGE_THRESHOLD)
                .put("shard", new JsonArray().add(id).add(limit))
                .put("properties", new JsonObject()
                        .put("$os", "JVM")
                        .put("$browser", "catnip")
                        .put("$device", "catnip")
                );
        if(presence != null) {
            data.put("presence", ((PresenceImpl) presence).asJson());
        }
        return basePayload(GatewayOp.IDENTIFY, data);
    }
    
    private JsonObject resume() {
        return basePayload(GatewayOp.RESUME, new JsonObject()
                .put("token", catnip.token())
                .put("compress", false)
                .put("session_id", catnip.sessionManager().session(id))
                .put("seq", catnip.sessionManager().seqnum(id))
                .put("properties", new JsonObject()
                        .put("$os", "JVM")
                        .put("$browser", "catnip")
                        .put("$device", "catnip")
                )
        );
    }
    
    private ShardInfo shardInfo() {
        return new ShardInfo(id, limit);
    }
}

/*
 * Copyright (c) 2019 amy, All rights reserved.
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

package com.mewna.catnip.util.task;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.impl.PresenceImpl;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnull;
import java.util.ArrayDeque;
import java.util.Queue;
import java.util.function.Consumer;

public class GatewayTask<T> extends QueueTask<T> {
    private final Catnip catnip;
    private final String id;
    private final long periodMs;
    private final long limit;
    private volatile boolean queued;
    private volatile boolean shutdown;
    
    public GatewayTask(@Nonnull final Queue<T> queue, @Nonnull final Consumer<T> action,
                       @Nonnull final Catnip catnip, final String id,
                       final long periodMs, final long limit) {
        super(queue, action);
        this.catnip = catnip;
        this.id = id;
        this.periodMs = periodMs;
        this.limit = limit;
    }
    
    public synchronized void shutdown() {
        shutdown = true;
        queue.clear();
    }
    
    @Override
    public synchronized void run() {
        if(shutdown || queued) {
            return;
        }
        while(!queue.isEmpty()) {
            if(catnip.gatewayRatelimiter().checkRatelimit(id, periodMs, limit).left) {
                if(!queued) {
                    queued = true;
                    catnip.vertx().setTimer(1000, __ -> run());
                }
                return;
            }
            action.accept(queue.poll());
        }
    }
    
    public static GatewayTask<JsonObject> gatewaySendTask(@Nonnull final Catnip catnip, @Nonnull final String id,
                                                          @Nonnull final Consumer<JsonObject> action) {
        return new GatewayTask<>(new ArrayDeque<>(), action, catnip, id, 60_000, 110);
    }
    
    public static GatewayTask<PresenceImpl> gatewayPresenceTask(@Nonnull final Catnip catnip, @Nonnull final String id,
                                                                @Nonnull final Consumer<PresenceImpl> action) {
        return new GatewayTask<>(new ArrayDeque<>(), action, catnip, id, 60_000, 5);
    }
}

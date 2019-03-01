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

import static com.mewna.catnip.shard.EventTypeImpl.event;

/**
 * @author amy
 * @since 10/17/18.
 */
public interface LifecycleEvent {
    // @formatter:off
    /**
     * Fired when the shard is created and is about to connect to the websocket
     * gateway. The payload is a shard id / total pair.
     */
    EventType<ShardInfo> CONNECTING   = event(Raw.CONNECTING, ShardInfo.class);
    /**
     * Fired when the shard has connected to the websocket gateway, but has not
     * yet sent an IDENTIFY payload. The payload is a shard id / total pair.
     */
    EventType<ShardInfo> CONNECTED    = event(Raw.CONNECTED, ShardInfo.class);
    /**
     * Fired when the shard has disconnected from the websocket gateway, and
     * will (hopefully) be reconnecting. The payload is a shard id / total
     * pair.
     */
    EventType<ShardInfo> DISCONNECTED = event(Raw.DISCONNECTED, ShardInfo.class);
    /**
     * Fired when the shard has successfully IDENTIFYd with the websocket
     * gateway. This is effectively the same as listening on
     * {@link DiscordEvent#READY}. The payload is a shard id / total pair.
     */
    EventType<ShardInfo> IDENTIFIED   = event(Raw.IDENTIFIED, ShardInfo.class);
    /**
     * Fired when the shard has successfully RESUMEd with the websocket
     * gateway. The payload is a shard id / total pair.
     */
    EventType<ShardInfo> RESUMED      = event(Raw.RESUMED, ShardInfo.class);
    /**
     * Fired when the shard has closed the gateway websocket.
     */
    EventType<ShardInfo> CLOSED       = event(Raw.CLOSED, ShardInfo.class);
    // @formatter:on
    
    interface Raw {
        // @formatter:off
        String CONNECTING   = "CONNECTING";
        String CONNECTED    = "CONNECTED";
        String DISCONNECTED = "DISCONNECTED";
        String IDENTIFIED   = "IDENTIFIED";
        String RESUMED      = "RESUMED";
        String CLOSED       = "CLOSED";
        // @formatter:on
    }
}

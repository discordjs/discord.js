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

package com.mewna.catnip.shard;

/**
 * @author amy
 * @since 1/17/19.
 */
public enum ShardAddress {
    /**
     * Control messages for the shard. Start, stop, shutdown, get latency, ...
     */
    CONTROL("catnip:shard:$id:control"),
    
    /**
     * Directly send a websocket message. Generally you want
     * {@link #WEBSOCKET_QUEUE}.
     */
    WEBSOCKET_SEND("catnip:gateway:ws-outgoing:$id"),
    
    /**
     * Queue a websocket message to be sent later.
     */
    WEBSOCKET_QUEUE("catnip:gateway:ws-outgoing:$id:queue"),
    
    /**
     * Request the provided presence to be queued, <strong>OR</strong> request
     * for the shard's current presence to sent as a response to the message.
     * <p>
     * When sending {@code null} as the payload, you get a response with the
     * current presence. Sending a valid presence will queue an update.
     */
    PRESENCE_UPDATE_REQUEST("catnip:gateway:ws-outgoing:$id:presence-update"),
    
    /**
     * Queue a voice state update.
     */
    VOICE_STATE_UPDATE_QUEUE("catnip:gateway:ws-outgoing:$id:voice-state-update:queue"),
    ;

    private final String format;
    
    ShardAddress(final String format) {
        this.format = format;
    }
    
    public static String computeAddress(final ShardAddress address, final int id) {
        return address.format.replace("$id", Integer.toString(id));
    }
}

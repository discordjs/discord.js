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

import lombok.Getter;
import lombok.experimental.Accessors;

import javax.annotation.Nonnegative;

/**
 * Discord-specific websocket gateway close codes. These are sent by the
 * gateway when we do something bad that's within the scope of what the gateway
 * handles. This just copies the error messages directly from the docs because
 * I think that they're probably good enough.
 * <p>
 * See also: https://discordapp.com/developers/docs/topics/opcodes-and-status-codes
 *
 * @author amy
 * @since 11/19/18.
 */
@Getter
@Accessors(fluent = true)
public enum GatewayCloseCode {
    UNKNOWN_ERROR(4000, "We're not sure what went wrong. Try reconnecting?"),
    UNKNOWN_OPCODE(4001, "You sent an invalid Gateway opcode or an invalid payload for an opcode. Don't do that!"),
    DECODE_ERROR(4002, "You sent an invalid payload to us. Don't do that!"),
    NOT_AUTHENTICATED(4003, "You sent us a payload prior to identifying."),
    AUTHENTICATION_FAILED(4004, "The account token sent with your identify payload is incorrect."),
    ALREADY_AUTHENTICATED(4005, "You sent more than one identify payload. Don't do that!"),
    // There isn't a mistake here - there really is no close code 4006!
    INVALID_SEQ(4007, "The sequence sent when resuming the session was invalid. Reconnect and start a new session."),
    RATE_LIMITED(4008, "Woah nelly! You're sending payloads to us too quickly. Slow it down!"),
    SESSION_TIMEOUT(4009, "Your session timed out. Reconnect and start a new one."),
    INVALID_SHARD(4010, "You sent us an invalid shard when identifying."),
    SHARDING_REQUIRED(4011, "The session would have handled too many guilds - you are required to shard your connection in order to connect."),
    ;
    private final int code;
    private final String message;
    
    GatewayCloseCode(final int code, final String message) {
        this.code = code;
        this.message = message;
    }
    
    public static GatewayCloseCode byId(@Nonnegative final int id) {
        for(final GatewayCloseCode value : values()) {
            if(value.code == id) {
                return value;
            }
        }
        return null;
    }
}

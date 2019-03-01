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

package com.mewna.catnip.util;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.RequiresCatnip;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.MessageCodec;
import io.vertx.core.json.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author amy
 * @since 9/2/18.
 */
public class JsonPojoCodec<T> implements MessageCodec<T, T> {
    
    private static final Logger log = LoggerFactory.getLogger(JsonPojoCodec.class);
    
    private final Catnip catnip;
    private final Class<T> type;
    
    @SuppressWarnings("unchecked")
    public JsonPojoCodec(final Catnip catnip, final Class<T> type) {
        this.catnip = catnip;
        this.type = type;
    }
    
    @Override
    public void encodeToWire(final Buffer buffer, final T t) {
        final byte[] data = JsonObject.mapFrom(t).encode().getBytes();
        buffer.appendInt(data.length);
        buffer.appendBytes(data);
    }
    
    @Override
    public T decodeFromWire(final int pos, final Buffer buffer) {
        final int length = buffer.getInt(pos);
        final String rawJson = buffer.getString(pos + 4, pos + 4 + length);
        log.trace("Received raw json {}", rawJson);
        final JsonObject data = new JsonObject(rawJson);
        final T object = data.mapTo(type);
        if(object instanceof RequiresCatnip) {
            ((RequiresCatnip) object).catnip(catnip);
        }
        return object;
    }
    
    @Override
    public T transform(final T t) {
        if(t instanceof RequiresCatnip) {
            ((RequiresCatnip) t).catnip(catnip);
        }
        return t;
    }
    
    @Override
    public String name() {
        return "JsonPojoCodec-" + type.getName();
    }
    
    @Override
    public byte systemCodecID() {
        return -1;
    }
}

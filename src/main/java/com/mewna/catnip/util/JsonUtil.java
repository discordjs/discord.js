/*
 * Copyright (c) 2018 amy, All rights reserved.
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

package com.mewna.catnip.util;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.*;
import java.util.function.Function;

public final class JsonUtil {
    private JsonUtil() {}
    
    @Nonnull
    @CheckReturnValue
    public static <T> List<T> toList(@Nullable final JsonArray array, @Nonnull final Function<JsonObject, T> mapper) {
        if(array == null) {
            return Collections.emptyList();
        }
        final List<T> ret = new ArrayList<>(array.size());
        for(final Object object : array) {
            if(!(object instanceof JsonObject)) {
                throw new IllegalArgumentException("Expected all values to be JsonObjects, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            ret.add(mapper.apply((JsonObject) object));
        }
        return Collections.unmodifiableList(ret);
    }
    
    @Nonnull
    @CheckReturnValue
    public static <T> Set<T> toSet(@Nullable final JsonArray array, @Nonnull final Function<JsonObject, T> mapper) {
        if(array == null) {
            return Collections.emptySet();
        }
        return Collections.unmodifiableSet(toMutableSet(array, mapper));
    }
    
    @Nonnull
    @CheckReturnValue
    public static <T> Set<T> toMutableSet(@Nullable final JsonArray array, @Nonnull final Function<JsonObject, T> mapper) {
        if(array == null) {
            return new HashSet<>();
        }
        final Set<T> ret = new HashSet<>(array.size());
        for(final Object object : array) {
            if(!(object instanceof JsonObject)) {
                throw new IllegalArgumentException("Expected all values to be JsonObjects, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            ret.add(mapper.apply((JsonObject) object));
        }
        return ret;
    }
    
    @Nonnull
    @CheckReturnValue
    public static <T> Map<String, T> toMap(@Nullable final JsonArray array,
                                           @Nonnull final Function<JsonObject, String> keyFunction,
                                           @Nonnull final Function<JsonObject, T> mapper) {
        if(array == null) {
            return Collections.emptyMap();
        }
        
        final Map<String, T> map = new HashMap<>(array.size());
        
        for(final Object object : array) {
            if(!(object instanceof JsonObject)) {
                throw new IllegalArgumentException("Expected all values to be JsonObjects, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            final JsonObject jsonObject = (JsonObject) object;
            final String key = keyFunction.apply(jsonObject);
            if(key == null || key.isEmpty()) {
                throw new IllegalArgumentException("keyFunction returned null or empty string, which isn't allowed!");
            }
            map.put(key, mapper.apply(jsonObject));
        }
        return Collections.unmodifiableMap(map);
    }
    
    @Nonnull
    @CheckReturnValue
    public static List<String> toStringList(@Nullable final JsonArray array) {
        if(array == null) {
            return Collections.emptyList();
        }
        final List<String> ret = new ArrayList<>(array.size());
        for(final Object object : array) {
            if(!(object instanceof String)) {
                throw new IllegalArgumentException("Expected all values to be strings, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            ret.add((String) object);
        }
        return Collections.unmodifiableList(ret);
    }
    
    @Nonnull
    @CheckReturnValue
    public static Set<String> toStringSet(@Nullable final JsonArray array) {
        if(array == null) {
            return Collections.emptySet();
        }
        final Set<String> ret = new HashSet<>(array.size());
        for(final Object object : array) {
            if(!(object instanceof String)) {
                throw new IllegalArgumentException("Expected all values to be strings, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            ret.add((String) object);
        }
        return Collections.unmodifiableSet(ret);
    }
    
    @Nonnull
    @CheckReturnValue
    public static List<Long> toSnowflakeList(@Nullable final JsonArray array) {
        if(array == null) {
            return Collections.emptyList();
        }
        final List<Long> ret = new ArrayList<>(array.size());
        for(final Object object : array) {
            if(object instanceof Number) {
                ret.add(((Number)object).longValue());
            } else if(object instanceof String) {
                try {
                    ret.add(Long.parseUnsignedLong((String)object));
                } catch(final NumberFormatException e) {
                    throw new IllegalArgumentException("Malformed snowflake '" + object + '\'', e);
                }
            } else {
                throw new IllegalArgumentException("Expected all values to be snowflakes, but found " +
                        (object == null ? "null" : object.getClass()));
            }
        }
        return Collections.unmodifiableList(ret);
    }
    
    @Nonnull
    @CheckReturnValue
    public static <T> Function<JsonArray, List<T>> mapObjectContents(@Nonnull final Function<JsonObject, T> builder) {
        return array -> {
            final List<T> result = new ArrayList<>(array.size());
            for(final Object object : array) {
                if(!(object instanceof JsonObject)) {
                    throw new IllegalArgumentException("Expected array to contain only objects, but found " +
                            (object == null ? "null" : object.getClass())
                    );
                }
                result.add(builder.apply((JsonObject) object));
            }
            return Collections.unmodifiableList(result);
        };
    }
}

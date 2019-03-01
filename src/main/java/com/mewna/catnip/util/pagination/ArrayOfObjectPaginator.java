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

package com.mewna.catnip.util.pagination;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.function.Function;

/**
 * @author natanbc
 * @since 10/9/18.
 */
@SuppressWarnings("WeakerAccess")
public abstract class ArrayOfObjectPaginator<T, P extends ArrayOfObjectPaginator<T, P>> extends BasePaginator<T, JsonArray, P> {
    private final Function<JsonObject, T> mapper;
    
    public ArrayOfObjectPaginator(@Nonnull final Function<T, String> idOf, @Nonnull final Function<JsonObject, T> mapper,
                                  @Nonnegative final int maxRequestSize) {
        super(idOf, maxRequestSize);
        this.mapper = mapper;
    }
    
    @Override
    protected void update(@Nonnull final RequestState<T> state, @Nonnull final JsonArray data) {
        for(final Object object : data) {
            if(!(object instanceof JsonObject)) {
                throw new IllegalArgumentException("Expected all values to be JsonObjects, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            state.update(mapper.apply((JsonObject) object));
            if(state.done()) {
                return;
            }
        }
    }
}

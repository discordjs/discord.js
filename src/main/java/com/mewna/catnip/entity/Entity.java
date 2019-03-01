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

package com.mewna.catnip.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mewna.catnip.Catnip;
import com.mewna.catnip.util.CatnipMeta;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnull;

/**
 * A single entity in catnip.
 *
 * @author natanbc
 * @since 5/9/18.
 */
@SuppressWarnings("InterfaceMayBeAnnotatedFunctional")
public interface Entity {
    /**
     * Converts JSON to the specified entity type.
     *
     * @param catnip The catnip instance to attach to the entity.
     * @param type   The type of the entity.
     * @param json   The JSON to convert.
     * @param <T>    The type of the entity.
     *
     * @return The newly-created entity.
     */
    @Nonnull
    @JsonIgnore
    @SuppressWarnings("ClassReferencesSubclass")
    static <T> T fromJson(@Nonnull final Catnip catnip, @Nonnull final Class<T> type, @Nonnull final JsonObject json) {
        final String v = json.getString("v");
        final JsonObject data = json.getJsonObject("d");
        
        if(!CatnipMeta.VERSION.equals(v)) {
            catnip.logAdapter().warn("Attempting to deserialize an entity from catnip v{}, but we're on v{}! " +
                    "This may not work, so update your versions!", v, CatnipMeta.VERSION);
        }
        
        final T t = data.mapTo(type);
        // Yeah I know this is a Bad Thing:tm: to do with referencing the
        // subclass, but it was the easiest way to do things :<
        if(t instanceof RequiresCatnip) {
            ((RequiresCatnip) t).catnip(catnip);
        }
        return t;
    }
    
    
    /**
     * Returns the catnip instance associated with this entity.
     *
     * @return The catnip instance of this entity.
     */
    @JsonIgnore
    Catnip catnip();
    
    /**
     * Map this entity instance to a JSON object.
     *
     * @return A JSON object representing this entity.
     */
    @Nonnull
    @JsonIgnore
    default JsonObject toJson() {
        return new JsonObject()
                .put("d", JsonObject.mapFrom(this))
                .put("v", CatnipMeta.VERSION)
                ;
    }
}

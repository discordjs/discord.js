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

package com.mewna.catnip.rest.guild;

import com.google.common.collect.ImmutableSet;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

@RequiredArgsConstructor
@Accessors(fluent = true, chain = true)
@Getter
@SuppressWarnings("unused")
public class PositionUpdater {
    private final String guildId;
    private final boolean reverseOrder;
    
    @Getter(AccessLevel.NONE)
    private final Map<String, Integer> positions = new HashMap<>(); // autoboxing >:(
    
    private String entityId;
    
    @Nonnull
    @CheckReturnValue
    public PositionUpdater select(@Nonnull final String entityId) {
        this.entityId = entityId;
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public PositionUpdater position(@Nonnegative final int position) {
        if(entityId == null) {
            throw new IllegalStateException("No entity selected!");
        }
        positions.put(entityId, position);
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public PositionUpdater increment() {
        if(entityId == null) {
            throw new IllegalStateException("No entity selected");
        }
        // not using computeIfAbsent because extra write needed otherwise
        final Integer old = positions.get(entityId);
        if(old == null) {
            positions.put(entityId, positions.size() - 1);
            return this;
        }
        positions.put(entityId, reverseOrder ? old - 1 : old + 1);
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public PositionUpdater decrement() {
        if(entityId == null) {
            throw new IllegalStateException("No entity selected!");
        }
        final Integer old = positions.get(entityId);
        if(old == null) {
            positions.put(entityId, positions.size() - 1);
            return this;
        }
        positions.put(entityId, reverseOrder ? old + 1 : old - 1);
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public Collection<String> channelIds() {
        return ImmutableSet.copyOf(positions.keySet());
    }
    
    @Nonnull
    @CheckReturnValue
    public Collection<Integer> positions() {
        return ImmutableSet.copyOf(positions.values());
    }
    
    @Nonnull
    @CheckReturnValue
    public Collection<Entry<String, Integer>> entries() {
        return ImmutableSet.copyOf(positions.entrySet());
    }
}

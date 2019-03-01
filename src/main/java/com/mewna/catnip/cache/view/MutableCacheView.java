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

package com.mewna.catnip.cache.view;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.function.LongPredicate;

/**
 * Mutable {@link CacheView cache view}, which allows modifications to the storage. Used by
 * {@link com.mewna.catnip.cache.MemoryEntityCache MemoryEntityCache} to
 * allow custom implementations.
 *
 * @param <T> Type of the entity held by this cache.
 *
 * @author natanbc
 * @since 12/23/18
 */
public interface MutableCacheView<T> extends CacheView<T> {
    void removeIf(@Nonnull LongPredicate predicate);
    
    @Nullable
    T put(long key, @Nonnull T value);
    
    @Deprecated
    @Nullable
    default T put(@Nonnull final String key, @Nonnull final T value) {
        return put(Long.parseUnsignedLong(key), value);
    }
    
    @Nullable
    T remove(final long key);
    
    @Deprecated
    @Nullable
    default T remove(@Nonnull final String key) {
        return remove(Long.parseUnsignedLong(key));
    }
}

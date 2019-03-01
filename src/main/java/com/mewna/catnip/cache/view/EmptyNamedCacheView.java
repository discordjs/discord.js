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

package com.mewna.catnip.cache.view;

import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.function.Supplier;

/**
 * Always empty {@link NamedCacheView named cache view}.
 *
 * @author natanbc
 * @see NamedCacheView#empty()
 * @since 12/15/18
 */
public class EmptyNamedCacheView<T> extends EmptyCacheView<T> implements NamedCacheView<T> {
    public static final NamedCacheView<?> INSTANCE = new EmptyNamedCacheView<>();
    
    @Nonnull
    @Override
    public Collection<T> findByName(@Nonnull final String name, final boolean ignoreCase) {
        return Collections.emptyList();
    }
    
    @Nonnull
    @Override
    public <C extends Collection<T>> C findByName(@Nonnull final String name, final boolean ignoreCase, @Nonnull final Supplier<C> supplier) {
        return Objects.requireNonNull(supplier.get(), "Provided collection may not be null");
    }
    
    @Nonnull
    @Override
    public Collection<T> findByNameContains(@Nonnull final String name, final boolean ignoreCase) {
        return Collections.emptyList();
    }
    
    @Nonnull
    @Override
    public <C extends Collection<T>> C findByNameContains(@Nonnull final String name, final boolean ignoreCase, @Nonnull final Supplier<C> supplier) {
        return Objects.requireNonNull(supplier.get(), "Provided collection may not be null");
    }
    
    @Nonnull
    @Override
    public Collection<T> findByNameStartsWith(@Nonnull final String name, final boolean ignoreCase) {
        return Collections.emptyList();
    }
    
    @Nonnull
    @Override
    public <C extends Collection<T>> C findByNameStartsWith(@Nonnull final String name, final boolean ignoreCase, @Nonnull final Supplier<C> supplier) {
        return Objects.requireNonNull(supplier.get(), "Provided collection may not be null");
    }
    
    @Nonnull
    @Override
    public Collection<T> findByNameEndsWith(@Nonnull final String name, final boolean ignoreCase) {
        return Collections.emptyList();
    }
    
    @Nonnull
    @Override
    public <C extends Collection<T>> C findByNameEndsWith(@Nonnull final String name, final boolean ignoreCase, @Nonnull final Supplier<C> supplier) {
        return Objects.requireNonNull(supplier.get(), "Provided collection may not be null");
    }
}

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
import java.util.function.Supplier;

/**
 * A {@link CacheView CacheView} that provides utilities for finding
 * elements based on their name.
 *
 * @param <T> Type of the entity held by this cache.
 *
 * @author natanbc
 * @since 12/15/18
 */
public interface NamedCacheView<T> extends CacheView<T> {
    @Nonnull
    @SuppressWarnings("unchecked")
    static <T> NamedCacheView<T> empty() {
        return (NamedCacheView<T>) EmptyNamedCacheView.INSTANCE;
    }
    
    /**
     * Finds all entities with a name equal to the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     *
     * @return All elements that have a name equal to the provided.
     *
     * @see String#equals(Object)
     * @see String#equalsIgnoreCase(String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    Collection<T> findByName(@Nonnull String name, boolean ignoreCase);
    
    /**
     * Finds all entities with a name equal to the provided value.
     *
     * @param name Name to search for.
     *
     * @return All elements that have a name equal to the provided.
     *
     * @see String#equals(Object)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default Collection<T> findByName(@Nonnull final String name) {
        return findByName(name, false);
    }
    
    /**
     * Finds all entities with a name equal to the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#equals(Object)
     * @see String#equalsIgnoreCase(String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    <C extends Collection<T>> C findByName(@Nonnull String name, boolean ignoreCase, @Nonnull Supplier<C> supplier);
    
    /**
     * Finds all entities with a name equal to the provided value.
     *
     * @param name       Name to search for.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#equals(Object)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default <C extends Collection<T>> C findByName(@Nonnull final String name, @Nonnull final Supplier<C> supplier) {
        return findByName(name, false, supplier);
    }
    
    /**
     * Finds all entities whose name contains the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     *
     * @return All elements that have a name containing the provided.
     *
     * @see String#contains(CharSequence)
     * @see com.mewna.catnip.util.Utils#containsIgnoreCase(String, String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    Collection<T> findByNameContains(@Nonnull String name, boolean ignoreCase);
    
    /**
     * Finds all entities whose name contains the provided value.
     *
     * @param name Name to search for.
     *
     * @return All elements that have a name containing the provided.
     *
     * @see String#contains(CharSequence)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default Collection<T> findByNameContains(@Nonnull final String name) {
        return findByNameContains(name, false);
    }
    
    /**
     * Finds all entities whose name contains the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#contains(CharSequence)
     * @see com.mewna.catnip.util.Utils#containsIgnoreCase(String, String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    <C extends Collection<T>> C findByNameContains(@Nonnull String name, boolean ignoreCase, @Nonnull Supplier<C> supplier);
    
    /**
     * Finds all entities whose name contains the provided value.
     *
     * @param name       Name to search for.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#contains(CharSequence)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default <C extends Collection<T>> C findByNameContains(@Nonnull final String name, @Nonnull final Supplier<C> supplier) {
        return findByNameContains(name, false, supplier);
    }
    
    /**
     * Finds all entities whose name starts with the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     *
     * @return All elements that have a name starting with the provided.
     *
     * @see String#startsWith(String)
     * @see com.mewna.catnip.util.Utils#startsWithIgnoreCase(String, String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    Collection<T> findByNameStartsWith(@Nonnull String name, boolean ignoreCase);
    
    /**
     * Finds all entities whose name starts with the provided value.
     *
     * @param name Name to search for.
     *
     * @return All elements that have a name starting with the provided.
     *
     * @see String#startsWith(String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default Collection<T> findByNameStartsWith(@Nonnull final String name) {
        return findByNameStartsWith(name, false);
    }
    
    /**
     * Finds all entities whose name starts with the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#startsWith(String)
     * @see com.mewna.catnip.util.Utils#startsWithIgnoreCase(String, String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    <C extends Collection<T>> C findByNameStartsWith(@Nonnull String name, boolean ignoreCase, @Nonnull Supplier<C> supplier);
    
    /**
     * Finds all entities whose name starts with the provided value.
     *
     * @param name       Name to search for.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#startsWith(String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default <C extends Collection<T>> C findByNameStartsWith(@Nonnull final String name, @Nonnull final Supplier<C> supplier) {
        return findByNameStartsWith(name, false, supplier);
    }
    
    /**
     * Finds all entities whose name ends with the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     *
     * @return All elements that have a name ending with the provided.
     *
     * @see String#endsWith(String)
     * @see com.mewna.catnip.util.Utils#endsWithIgnoreCase(String, String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    Collection<T> findByNameEndsWith(@Nonnull String name, boolean ignoreCase);
    
    /**
     * Finds all entities whose name ends with the provided value.
     *
     * @param name Name to search for.
     *
     * @return All elements that have a name ending with the provided.
     *
     * @see String#endsWith(String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default Collection<T> findByNameEndsWith(@Nonnull final String name) {
        return findByNameEndsWith(name, false);
    }
    
    /**
     * Finds all entities whose name ends with the provided value.
     *
     * @param name       Name to search for.
     * @param ignoreCase Ignore casing differences between the entity
     *                   names and the provided name.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#endsWith(String)
     * @see com.mewna.catnip.util.Utils#endsWithIgnoreCase(String, String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    <C extends Collection<T>> C findByNameEndsWith(@Nonnull String name, boolean ignoreCase, @Nonnull Supplier<C> supplier);
    
    /**
     * Finds all entities whose name ends with the provided value.
     *
     * @param name       Name to search for.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @see String#endsWith(String)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    default <C extends Collection<T>> C findByNameEndsWith(@Nonnull final String name, @Nonnull final Supplier<C> supplier) {
        return findByNameEndsWith(name, false, supplier);
    }
}

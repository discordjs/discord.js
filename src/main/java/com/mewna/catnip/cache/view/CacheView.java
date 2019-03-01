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

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import java.util.*;
import java.util.function.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Represents a view of a given cache. When the cache is updated, the view is also updated.
 * This interface represents a low overhead API of reading the cache, without exposing methods
 * that may modify it, possibly leading to an inconsistent state.
 *
 * @param <T> Type of the entity held by this cache.
 *
 * @author natanbc
 * @since 12/15/18
 */
public interface CacheView<T> extends Iterable<T> {
    /**
     * @return An always empty cache view. Cannot be modified.
     */
    @Nonnull
    @SuppressWarnings("unchecked")
    static <T> CacheView<T> empty() {
        return (CacheView<T>) EmptyCacheView.INSTANCE;
    }
    
    /**
     * Iterates this view, providing all elements to the given consumer.
     *
     * @param action Action to execute on each element.
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    void forEach(Consumer<? super T> action);
    
    /**
     * @return The size of this cache.
     */
    @Nonnegative
    long size();
    
    /**
     * @return Whether or not this view is empty. Equivalent to {@code size() == 0}.
     */
    boolean isEmpty();
    
    /**
     * @param id ID of the entity to fetch.
     *
     * @return The element with the provided ID, or {@code null} if it isn't cached.
     */
    T getById(long id);
    
    /**
     * @param id ID of the entity to fetch.
     *
     * @return The element with the provided ID, or {@code null} if it isn't cached.
     */
    default T getById(@Nonnull final String id) {
        return getById(Long.parseUnsignedLong(id));
    }
    
    /**
     * Returns any element in this cache that matches the given filter. There are no order
     * guarantees if multiple elements match. Use with caution.
     *
     * @param filter Filter to find matching elements.
     *
     * @return Any element that matches the provided filter, or {@code null} if none match.
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    T findAny(@Nonnull Predicate<? super T> filter);
    
    /**
     * Returns all elements in this cache that matches the given filter. There are no order
     * guarantees if multiple elements match.
     *
     * @param filter Filter to find matching elements.
     *
     * @return A collection with all the matching elements. May be empty.
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    Collection<T> find(@Nonnull Predicate<? super T> filter);
    
    /**
     * Returns all elements in this cache that matches the given filter. There are no order
     * guarantees if multiple elements match.
     *
     * @param filter   Filter to find matching elements.
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the matching
     * elements. May be empty.
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    <C extends Collection<T>> C find(@Nonnull Predicate<? super T> filter, @Nonnull Supplier<C> supplier);
    
    /**
     * Performs a mutable reduction operation on the elements of this cache
     * using a {@code Collector}.
     *
     * @param <R> The type of the result.
     * @param <A> The intermediate accumulation type of the {@code Collector}.
     * @param collector The {@code Collector} describing the reduction.
     *
     * @return The result of the reduction.
     *
     * @see Stream#collect(Collector)
     * @see #collect(Supplier, BiConsumer, BiConsumer)
     * @see Collectors
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    <A, R> R collect(@Nonnull Collector<? super T, A, R> collector);
    
    /**
     * Performs a mutable reduction operation on the elements of this cache.
     *
     * @param <R> The type of the result.
     * @param supplier A function that creates a new result container. For a
     *                 parallel execution, this function may be called
     *                 multiple times and must return a fresh value each time.
     * @param accumulator An associative, non-interfering, stateless function
     *                    for incorporating an additional element into a result.
     * @param combiner An associative, non-interfering, stateless function
     *                 for combining two values, which must be compatible
     *                 with the accumulator function.
     *
     * @return The result of the reduction.
     *
     * @see Stream#collect(Supplier, BiConsumer, BiConsumer)
     * @see #collect(Supplier, BiConsumer, BiConsumer)
     * @see Collectors
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    <R> R collect(@Nonnull Supplier<R> supplier, @Nonnull BiConsumer<R, ? super T> accumulator, @Nonnull BiConsumer<R, R> combiner);
    
    /**
     * Performs a reduction on the elements of this cache, using the
     * provided identity, accumulation and combining functions.
     *
     * @param <U> The type of the result.
     * @param identity The identity value for the combiner function.
     * @param accumulator An associative, non-interfering, stateless function
     *                    for incorporating an additional element into a result.
     * @param combiner An associative, non-interfering, stateless function
     *                 for combining two values, which must be compatible
     *                 with the accumulator function
     *
     * @return the result of the reduction
     *
     * @see Stream#reduce(Object, BiFunction, BinaryOperator)
     * @see #reduce(BinaryOperator)
     * @see #reduce(Object, BinaryOperator)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    <U> U reduce(U identity, @Nonnull BiFunction<U, ? super T, U> accumulator, @Nonnull BinaryOperator<U> combiner);
    
    /**
     * Performs a reduction on the elements of this cache, using an
     * associative accumulation function, and returns an {@code Optional}
     * describing the reduced value, if any.
     *
     * @param accumulator An associative, non-interfering, stateless function
     *                    for combining two values.
     *
     * @return An {@link Optional} describing the result of the reduction.
     *
     * @throws NullPointerException If the result of the reduction is null.
     *
     * @see Stream#reduce(BinaryOperator)
     * @see #reduce(Object, BinaryOperator)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    @Nonnull
    Optional<T> reduce(@Nonnull BinaryOperator<T> accumulator);
    
    /**
     * Performs a reduction on the elements of this cache, using the
     * provided identity value and an associative accumulation function,
     * and returns the reduced value.
     *
     * @param identity The identity value for the accumulating function.
     * @param accumulator An associative, non-interfering, stateless function
     *                    for combining two values.
     *
     * @return the result of the reduction
     *
     * @see Stream#reduce(Object, BinaryOperator)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    T reduce(T identity, @Nonnull BinaryOperator<T> accumulator);
    
    /**
     * Returns whether any elements of this cache match the provided
     * predicate.  May not evaluate the predicate on all elements if not
     * necessary for determining the result.  If the cache is empty then
     * {@code false} is returned and the predicate is not evaluated.
     *
     * @param predicate A non-interfering, stateless predicate to apply
     *                  to elements of this cache.
     *
     * @return {@code true} if any elements of the cache match the provided
     *         predicate, otherwise {@code false}.
     *
     * @see Stream#anyMatch(Predicate)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    boolean anyMatch(@Nonnull Predicate<? super T> predicate);
    
    /**
     * Returns whether all elements of this cache match the provided predicate.
     * May not evaluate the predicate on all elements if not necessary for
     * determining the result.  If the cache is empty then {@code true} is
     * returned and the predicate is not evaluated.
     *
     * @param predicate A non-interfering, stateless predicate
     *                  to apply to elements of this cache.
     *
     * @return {@code true} if either all elements of the cache match the
     *         provided predicate or the cache is empty, otherwise {@code false}.
     *
     * @see Stream#allMatch(Predicate)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    boolean allMatch(@Nonnull Predicate<? super T> predicate);
    
    /**
     * Returns whether no elements of this cache match the provided predicate.
     * May not evaluate the predicate on all elements if not necessary for
     * determining the result.  If the cache is empty then {@code true} is
     * returned and the predicate is not evaluated.
     *
     * @param predicate A non-interfering, stateless predicate to apply
     *                  to elements of this cache.
     *
     * @return {@code true} if either no elements of the cache match the
     *         provided predicate or the cache is empty, otherwise {@code false}.
     *
     * @see Stream#noneMatch(Predicate)
     *
     * @implNote Implementations should attempt to perform this operation without
     *           copying the elements of this view whenever possible.
     */
    boolean noneMatch(@Nonnull Predicate<? super T> predicate);
    
    /**
     * Returns the minimum element of this cache according to the provided
     * {@code Comparator}. This is a special case of a reduction.
     *
     * @param comparator A non-interfering, stateless {@code Comparator}
     *                   to compare elements of this stream.
     *
     * @return An {@code Optional} describing the minimum element of this cache,
     *         or an empty {@code Optional} if the cache is empty.
     *
     * @throws NullPointerException If the minimum element is null.
     *
     * @see Stream#min(Comparator)
     */
    @Nonnull
    Optional<T> min(@Nonnull Comparator<? super T> comparator);
    
    /**
     * Returns the maximum element of this cache according to the provided
     * {@code Comparator}. This is a special case of a reduction.
     *
     * @param comparator A non-interfering, stateless {@code Comparator}
     *                   to compare elements of this stream.
     *
     * @return An {@code Optional} describing the maximum element of this cache,
     *         or an empty {@code Optional} if the cache is empty.
     *
     * @throws NullPointerException If the maximum element is null.
     *
     * @see Stream#max(Comparator)
     */
    @Nonnull
    Optional<T> max(@Nonnull Comparator<? super T> comparator);
    
    /**
     * Returns the amount of elements that match the provided predicate.
     *
     * @param filter Filter to find matching elements.
     *
     * @return Amount of matching elements.
     */
    @Nonnegative
    long count(@Nonnull Predicate<? super T> filter);
    
    /**
     * @return A view of all the keys in this cache. Updated if this cache is modified.
     *
     * @see Map#keySet()
     */
    @Nonnull
    Set<Long> keys();
    
    /**
     * @return A view of all the values in this cache. Updated if this cache is modified.
     *
     * @see Map#values()
     */
    @Nonnull
    Collection<T> values();
    
    /**
     * @return A snapshot of all the values in this cache. <b>Not</b> updated if this cache is modified.
     *
     * @see #values()
     * @see #snapshot(Supplier)
     */
    @Nonnull
    Collection<T> snapshot();
    
    /**
     * @param supplier Supplier for the collection to add the elements to. The returned
     *                 collection <b>must</b> be mutable.
     *
     * @return The collection returned by {@code supplier}, after adding the cached
     * elements. May be empty.
     *
     * @see #values()
     * @see #snapshot()
     */
    @Nonnull
    <C extends Collection<T>> C snapshot(@Nonnull Supplier<C> supplier);
    
    /**
     * @return A stream with the elements cached, in no specific order.
     *
     * @see Collection#stream()
     */
    @Nonnull
    default Stream<T> stream() {
        return StreamSupport.stream(spliterator(), false);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    @Nonnull
    default Spliterator<T> spliterator() {
        return Spliterators.spliteratorUnknownSize(iterator(),
                Spliterator.DISTINCT | Spliterator.NONNULL | Spliterator.IMMUTABLE);
    }
}

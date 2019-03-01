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

import com.koloboke.collect.LongIterator;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.*;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import java.util.function.*;
import java.util.stream.Collector;

/**
 * Default {@link CacheView CacheView} implementation.
 *
 * @param <T> Type of the entity held by this cache.
 *
 * @author natanbc
 * @since 12/15/18
 */
@SuppressWarnings("WeakerAccess")
public class DefaultCacheView<T> implements MutableCacheView<T> {
    protected final LongEntityMap<T> map = LongEntityMap.create();
    protected final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    @Override
    public void removeIf(@Nonnull final LongPredicate predicate) {
        lock.writeLock().lock();
        try {
            final LongIterator iterator = map.iterator();
            while(iterator.hasNext()) {
                if(predicate.test(iterator.nextLong())) {
                    iterator.remove();
                }
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    @Nullable
    @Override
    public T put(final long key, @Nonnull final T value) {
        lock.writeLock().lock();
        try {
            return map.put(key, value);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    @Nullable
    @Override
    public T remove(final long key) {
        lock.writeLock().lock();
        try {
            return map.remove(key);
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    @Override
    public void forEach(final Consumer<? super T> action) {
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                action.accept(element);
            }
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnegative
    @Override
    public long size() {
        lock.readLock().lock();
        try {
            return map.size();
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public boolean isEmpty() {
        lock.readLock().lock();
        try {
            return map.isEmpty();
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public T getById(final long id) {
        lock.readLock().lock();
        try {
            return map.get(id);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public T findAny(@Nonnull final Predicate<? super T> filter) {
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                if(filter.test(element)) {
                    return element;
                }
            }
            return null;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnull
    @Override
    public Collection<T> find(@Nonnull final Predicate<? super T> filter) {
        return find(filter, ArrayList::new);
    }
    
    @Nonnull
    @Override
    public <C extends Collection<T>> C find(@Nonnull final Predicate<? super T> filter, @Nonnull final Supplier<C> supplier) {
        final C collection = Objects.requireNonNull(supplier.get(), "Provided collection may not be null");
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                if(filter.test(element)) {
                    collection.add(element);
                }
            }
            return collection;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnull
    @Override
    public <A, R> R collect(@Nonnull final Collector<? super T, A, R> collector) {
        final A a = collector.supplier().get();
        final BiConsumer<A, ? super T> accumulator = collector.accumulator();
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                accumulator.accept(a, element);
            }
            return collector.finisher().apply(a);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public <R> R collect(@Nonnull final Supplier<R> supplier, @Nonnull final BiConsumer<R, ? super T> accumulator, @Nonnull final BiConsumer<R, R> combiner) {
        final R result = supplier.get();
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                accumulator.accept(result, element);
            }
            return result;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public <U> U reduce(final U identity, @Nonnull final BiFunction<U, ? super T, U> accumulator, @Nonnull final BinaryOperator<U> combiner) {
        lock.readLock().lock();
        try {
            U result = identity;
            for(final T element : map.values()) {
                result = accumulator.apply(result, element);
            }
            return result;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnull
    @Override
    public Optional<T> reduce(@Nonnull final BinaryOperator<T> accumulator) {
        lock.readLock().lock();
        try {
            final Iterator<T> it = map.values().iterator();
            if(!it.hasNext()) {
                return Optional.empty();
            }
            T result = it.next();
            while(it.hasNext()) {
                final T element = it.next();
                result = accumulator.apply(result, element);
            }
            return Optional.of(result);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public T reduce(final T identity, @Nonnull final BinaryOperator<T> accumulator) {
        lock.readLock().lock();
        try {
            T result = identity;
            for (final T element : map.values()) {
                result = accumulator.apply(result, element);
            }
            return result;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public boolean anyMatch(@Nonnull final Predicate<? super T> predicate) {
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                if(predicate.test(element)) {
                    return true;
                }
            }
            return false;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public boolean allMatch(@Nonnull final Predicate<? super T> predicate) {
        lock.readLock().lock();
        try {
            for(final T element : map.values()) {
                if(!predicate.test(element)) {
                    return false;
                }
            }
            return true;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public boolean noneMatch(@Nonnull final Predicate<? super T> predicate) {
        return !anyMatch(predicate);
    }
    
    @Nonnull
    @Override
    public Optional<T> min(@Nonnull final Comparator<? super T> comparator) {
        lock.readLock().lock();
        try {
            final Iterator<T> it = map.values().iterator();
            if(!it.hasNext()) {
                return Optional.empty();
            }
            T min = it.next();
            while(it.hasNext()) {
                final T element = it.next();
                if(comparator.compare(min, element) > 0) {
                    min = element;
                }
            }
            return Optional.of(min);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnull
    @Override
    public Optional<T> max(@Nonnull final Comparator<? super T> comparator) {
        lock.readLock().lock();
        try {
            final Iterator<T> it = map.values().iterator();
            if(!it.hasNext()) {
                return Optional.empty();
            }
            T max = it.next();
            while(it.hasNext()) {
                final T element = it.next();
                if(comparator.compare(max, element) < 0) {
                    max = element;
                }
            }
            return Optional.of(max);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Override
    public long count(@Nonnull final Predicate<? super T> filter) {
        lock.readLock().lock();
        try {
            long count = 0;
            for(final T element : map.values()) {
                if(filter.test(element)) {
                    count++;
                }
            }
            return count;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnull
    @Override
    public Set<Long> keys() {
        return Collections.unmodifiableSet(map.keySet());
    }
    
    @Nonnull
    @Override
    public Collection<T> values() {
        return Collections.unmodifiableCollection(map.values());
    }
    
    @Nonnull
    @Override
    public Collection<T> snapshot() {
        lock.readLock().lock();
        try {
            final Collection<T> values = map.values();
            final Collection<T> r = new ArrayList<>((int)size());
            //this is actually more efficient than addAll(),
            //as addAll() on ArrayList requires calls Collection#toArray(),
            //while this won't allocate any temporary array due to the
            //initial size of the list.
            //noinspection UseBulkOperation
            values.forEach(r::add);
            return r;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    @Nonnull
    @Override
    public <C extends Collection<T>> C snapshot(@Nonnull final Supplier<C> supplier) {
        final C r = Objects.requireNonNull(supplier.get(), "Provided collection may not be null");
        lock.readLock().lock();
        try {
            final Collection<T> values = map.values();
            r.addAll(values);
        } finally {
            lock.readLock().unlock();
        }
        return r;
    }
    
    @Nonnull
    @Override
    public Iterator<T> iterator() {
        return Collections.unmodifiableCollection(map.values()).iterator();
    }
}

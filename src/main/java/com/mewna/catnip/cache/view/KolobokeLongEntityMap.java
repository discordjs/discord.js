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

import com.koloboke.collect.*;
import com.koloboke.collect.hash.HashConfig;
import com.koloboke.collect.impl.*;
import com.koloboke.collect.impl.hash.Hash;
import com.koloboke.collect.impl.hash.HashConfigWrapper;
import com.koloboke.collect.impl.hash.LHash;
import com.koloboke.collect.impl.hash.LHashCapacities;
import com.koloboke.collect.map.LongObjMap;
import com.koloboke.collect.set.LongSet;
import com.koloboke.collect.set.ObjSet;
import com.koloboke.collect.set.hash.HashLongSet;
import com.koloboke.collect.set.hash.HashObjSet;
import com.koloboke.function.LongObjConsumer;
import com.koloboke.function.LongObjPredicate;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.lang.reflect.Array;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Consumer;
import java.util.function.LongConsumer;
import java.util.function.LongPredicate;
import java.util.function.Predicate;

@SuppressWarnings(value = { "all" , "unsafe" , "deprecation" , "overloads" , "rawtypes" })
final class KolobokeLongEntityMap<T>  implements LongEntityMap<T> {
    KolobokeLongEntityMap(int expectedSize) {
        this.init(DEFAULT_CONFIG_WRAPPER, expectedSize);
    }
    
    static void verifyConfig(HashConfig config) {
        if ((config.getGrowthFactor()) != 2.0) {
            throw new IllegalArgumentException(((((((config + " passed, HashConfig for a hashtable\n") + "implementation with linear probing must have growthFactor of 2.0.\n") + "A Koloboke Compile-generated hashtable implementation could have\n") + "a different growth factor, if the implemented type is annotated with\n") + "@com.koloboke.compile.hash.algo.openaddressing.QuadraticProbing or\n") + "@com.koloboke.compile.hash.algo.openaddressing.DoubleHashing"));
        }
    }
    
    @Nonnull
    public final HashConfig hashConfig() {
        return configWrapper().config();
    }
    
    long freeValue;
    
    public long sizeAsLong() {
        return ((long) (size()));
    }
    
    T[] values;
    
    long[] set;
    
    public final boolean noRemoved() {
        return true;
    }
    
    public final boolean isEmpty() {
        return (size()) == 0;
    }
    
    public final boolean containsKey(Object key) {
        return contains(key);
    }
    
    public final int freeSlots() {
        return (capacity()) - (size());
    }
    
    private HashConfigWrapper configWrapper;
    
    @Nonnull
    public long[] keys() {
        return set;
    }
    
    int size;
    
    public final int removedSlots() {
        return 0;
    }
    
    private int maxSize;
    
    public int capacity() {
        return set.length;
    }
    
    @Nonnull
    public HashLongSet keySet() {
        return new KolobokeLongEntityMap.KeyView();
    }
    
    public final double currentLoad() {
        return ((double) (size())) / ((double) (capacity()));
    }
    
    final void init(HashConfigWrapper configWrapper, int size, long freeValue) {
        KolobokeLongEntityMap.this.freeValue = freeValue;
        init(configWrapper, size);
    }
    
    public void forEach(Consumer<? super Long> action) {
        if (action == null)
            throw new NullPointerException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return ;
        
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                action.accept(key);
            }
        }
    }
    
    boolean nullableValueEquals(@Nullable
                                        T a, @Nullable
                                        T b) {
        return (a == b) || ((a != null) && (valueEquals(a, b)));
    }
    
    public final HashConfigWrapper configWrapper() {
        return configWrapper;
    }
    
    class KeyView extends AbstractLongKeyView implements HashLongSet , InternalLongCollectionOps , KolobokeLongEntityMap.Support.SeparateKVLongLHash {
        @Nonnull
        @Override
        public HashConfig hashConfig() {
            return KolobokeLongEntityMap.this.hashConfig();
        }
        
        @Override
        public HashConfigWrapper configWrapper() {
            return KolobokeLongEntityMap.this.configWrapper();
        }
        
        @Override
        public int size() {
            return KolobokeLongEntityMap.this.size();
        }
        
        @Override
        public double currentLoad() {
            return KolobokeLongEntityMap.this.currentLoad();
        }
        
        @Override
        public long freeValue() {
            return KolobokeLongEntityMap.this.freeValue();
        }
        
        @Override
        public boolean supportRemoved() {
            return KolobokeLongEntityMap.this.supportRemoved();
        }
        
        @Override
        public long removedValue() {
            return KolobokeLongEntityMap.this.removedValue();
        }
        
        @Nonnull
        @Override
        public long[] keys() {
            return KolobokeLongEntityMap.this.keys();
        }
        
        @Override
        public int capacity() {
            return KolobokeLongEntityMap.this.capacity();
        }
        
        @Override
        public int freeSlots() {
            return KolobokeLongEntityMap.this.freeSlots();
        }
        
        @Override
        public boolean noRemoved() {
            return KolobokeLongEntityMap.this.noRemoved();
        }
        
        @Override
        public int removedSlots() {
            return KolobokeLongEntityMap.this.removedSlots();
        }
        
        @Override
        public int modCount() {
            return 0;
        }
        
        @Override
        public final boolean contains(Object o) {
            return KolobokeLongEntityMap.this.contains(o);
        }
        
        @Override
        public boolean contains(long key) {
            return KolobokeLongEntityMap.this.contains(key);
        }
        
        @Override
        public void forEach(Consumer<? super Long> action) {
            KolobokeLongEntityMap.this.forEach(action);
        }
        
        @Override
        public void forEach(LongConsumer action) {
            KolobokeLongEntityMap.this.forEach(action);
        }
        
        @Override
        public boolean forEachWhile(LongPredicate predicate) {
            return KolobokeLongEntityMap.this.forEachWhile(predicate);
        }
        
        @Override
        public boolean allContainingIn(LongCollection c) {
            return KolobokeLongEntityMap.this.allContainingIn(c);
        }
        
        @Override
        public boolean reverseAddAllTo(LongCollection c) {
            return KolobokeLongEntityMap.this.reverseAddAllTo(c);
        }
        
        @Override
        public boolean reverseRemoveAllFrom(LongSet s) {
            return KolobokeLongEntityMap.this.reverseRemoveAllFrom(s);
        }
        
        @Override
        @Nonnull
        public LongIterator iterator() {
            return KolobokeLongEntityMap.this.iterator();
        }
        
        @Override
        @Nonnull
        public LongCursor cursor() {
            return setCursor();
        }
        
        @Override
        @Nonnull
        public Object[] toArray() {
            return KolobokeLongEntityMap.this.toArray();
        }
        
        @Override
        @Nonnull
        public <T2>  T2[] toArray(@Nonnull
                                          T2[] a) {
            return KolobokeLongEntityMap.this.toArray(a);
        }
        
        @Override
        public long[] toLongArray() {
            return KolobokeLongEntityMap.this.toLongArray();
        }
        
        @Override
        public long[] toArray(long[] a) {
            return KolobokeLongEntityMap.this.toArray(a);
        }
        
        @Override
        public int hashCode() {
            return setHashCode();
        }
        
        @Override
        public String toString() {
            return setToString();
        }
        
        @Override
        public boolean shrink() {
            return KolobokeLongEntityMap.this.shrink();
        }
        
        @Override
        public final boolean remove(Object o) {
            return justRemove(((Long) (o)));
        }
        
        @Override
        public boolean removeLong(long v) {
            return justRemove(v);
        }
        
        @Override
        public boolean removeIf(Predicate<? super Long> filter) {
            return KolobokeLongEntityMap.this.removeIf(filter);
        }
        
        @Override
        public boolean removeIf(LongPredicate filter) {
            return KolobokeLongEntityMap.this.removeIf(filter);
        }
        
        @Override
        public boolean removeAll(@Nonnull
                                         Collection<?> c) {
            if (c instanceof LongCollection) {
                if (c instanceof InternalLongCollectionOps) {
                    InternalLongCollectionOps c2 = ((InternalLongCollectionOps) (c));
                    if ((c2.size()) < (KolobokeLongEntityMap.KeyView.this.size())) {
                        return c2.reverseRemoveAllFrom(KolobokeLongEntityMap.KeyView.this);
                    }
                }
                return KolobokeLongEntityMap.this.removeAll(KolobokeLongEntityMap.KeyView.this, ((LongCollection) (c)));
            }
            return KolobokeLongEntityMap.this.removeAll(KolobokeLongEntityMap.KeyView.this, c);
        }
        
        @Override
        public boolean retainAll(@Nonnull
                                         Collection<?> c) {
            return KolobokeLongEntityMap.this.retainAll(KolobokeLongEntityMap.KeyView.this, c);
        }
        
        @Override
        public void clear() {
            KolobokeLongEntityMap.this.clear();
        }
    }
    
    boolean valueEquals(@Nonnull
                                T a, @Nullable
                                T b) {
        return a.equals(b);
    }
    
    public long freeValue() {
        return freeValue;
    }
    
    @Override
    public final int size() {
        return size;
    }
    
    int nullableValueHashCode(@Nullable
                                      T value) {
        return value != null ? valueHashCode(value) : 0;
    }
    
    public boolean supportRemoved() {
        return false;
    }
    
    int valueHashCode(@Nonnull
                              T value) {
        return value.hashCode();
    }
    
    public void forEach(LongConsumer action) {
        if (action == null)
            throw new NullPointerException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return ;
        
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                action.accept(key);
            }
        }
    }
    
    public long removedValue() {
        throw new UnsupportedOperationException();
    }
    
    int valueIndex(@Nullable
                           Object value) {
        if (value == null)
            return nullValueIndex();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return -1;
        
        T val = ((T) (value));
        int index = -1;
        long free = freeValue;
        long[] keys = set;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            if ((keys[i]) != free) {
                if (valueEquals(val, vals[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    
    @Nonnull
    public Equivalence<T> valueEquivalence() {
        return Equivalence.defaultEquality();
    }
    
    public boolean contains(Object key) {
        return contains(((Long) (key)).longValue());
    }
    
    public boolean containsEntry(long key, Object value) {
        int index = index(key);
        if (index >= 0) {
            return nullableValueEquals(values[index], ((T) (value)));
        } else {
            return false;
        }
    }
    
    public boolean contains(long key) {
        return (index(key)) >= 0;
    }
    
    final void init(HashConfigWrapper configWrapper, int size) {
        KolobokeLongEntityMap.verifyConfig(configWrapper.config());
        KolobokeLongEntityMap.this.configWrapper = configWrapper;
        KolobokeLongEntityMap.this.size = 0;
        internalInit(targetCapacity(size));
    }
    
    public boolean forEachWhile(LongPredicate predicate) {
        if (predicate == null)
            throw new NullPointerException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return true;
        
        boolean terminated = false;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (!(predicate.test(key))) {
                    terminated = true;
                    break;
                }
            }
        }
        return !terminated;
    }
    
    int index(long key) {
        long free;
        if (key != (free = freeValue)) {
            long[] keys = set;
            int capacityMask;
            int index;
            long cur;
            if ((cur = keys[(index = (LHash.SeparateKVLongKeyMixing.mix(key)) & (capacityMask = (keys.length) - 1))]) == key) {
                return index;
            } else {
                if (cur == free) {
                    return -1;
                } else {
                    while (true) {
                        if ((cur = keys[(index = (index - 1) & capacityMask)]) == key) {
                            return index;
                        } else if (cur == free) {
                            return -1;
                        }
                    }
                }
            }
        } else {
            return -1;
        }
    }
    
    private void internalInit(int capacity) {
        assert Maths.isPowerOf2(capacity);
        maxSize = maxSize(capacity);
        allocateArrays(capacity);
    }
    
    @Override
    public T get(Object key) {
        int index = index(((Long) (key)));
        if (index >= 0) {
            return values[index];
        } else {
            return null;
        }
    }
    
    private int nullValueIndex() {
        if (KolobokeLongEntityMap.this.isEmpty())
            return -1;
        
        int index = -1;
        long free = freeValue;
        long[] keys = set;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            if ((keys[i]) != free) {
                if ((vals[i]) == null) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    
    private int maxSize(int capacity) {
        return !(isMaxCapacity(capacity)) ? configWrapper.maxSize(capacity) : capacity - 1;
    }
    
    public boolean allContainingIn(LongCollection c) {
        if (KolobokeLongEntityMap.this.isEmpty())
            return true;
        
        boolean containsAll = true;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (!(c.contains(key))) {
                    containsAll = false;
                    break;
                }
            }
        }
        return containsAll;
    }
    
    @Override
    public T get(long key) {
        int index = index(key);
        if (index >= 0) {
            return values[index];
        } else {
            return null;
        }
    }
    
    @Override
    public boolean containsValue(Object value) {
        return (valueIndex(value)) >= 0;
    }
    
    private long findNewFreeOrRemoved() {
        long free = KolobokeLongEntityMap.this.freeValue;
        Random random = ThreadLocalRandom.current();
        long newFree;
        {
            do {
                newFree = ((long) (random.nextLong()));
            } while ((newFree == free) || ((index(newFree)) >= 0) );
        }
        return newFree;
    }
    
    boolean removeValue(@Nullable
                                Object value) {
        int index = valueIndex(value);
        if (index >= 0) {
            removeAt(index);
            return true;
        } else {
            return false;
        }
    }
    
    public boolean reverseAddAllTo(LongCollection c) {
        if (KolobokeLongEntityMap.this.isEmpty())
            return false;
        
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                changed |= c.add(key);
            }
        }
        return changed;
    }
    
    int insert(long key, T value) {
        long free;
        if (key == (free = freeValue)) {
            free = changeFree();
        }
        long[] keys = set;
        int capacityMask;
        int index;
        long cur;
        keyAbsent : if ((cur = keys[(index = (LHash.SeparateKVLongKeyMixing.mix(key)) & (capacityMask = (keys.length) - 1))]) != free) {
            if (cur == key) {
                return index;
            } else {
                while (true) {
                    if ((cur = keys[(index = (index - 1) & capacityMask)]) == free) {
                        break keyAbsent;
                    } else if (cur == key) {
                        return index;
                    }
                }
            }
        }
        keys[index] = key;
        values[index] = value;
        postInsertHook();
        return -1;
    }
    
    long changeFree() {
        long newFree = findNewFreeOrRemoved();
        LongArrays.replaceAll(set, freeValue, newFree);
        KolobokeLongEntityMap.this.freeValue = newFree;
        return newFree;
    }
    
    final void initForRehash(int newCapacity) {
        internalInit(newCapacity);
    }
    
    public boolean reverseRemoveAllFrom(LongSet s) {
        if ((KolobokeLongEntityMap.this.isEmpty()) || (s.isEmpty()))
            return false;
        
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                changed |= s.removeLong(key);
            }
        }
        return changed;
    }
    
    private void _MutableSeparateKVLongLHashSO_allocateArrays(int capacity) {
        set = new long[capacity];
        if ((freeValue) != 0)
            Arrays.fill(set, freeValue);
        
    }
    
    private void _MutableLHash_clear() {
        size = 0;
    }
    
    private void _MutableSeparateKVLongLHashSO_clear() {
        _MutableLHash_clear();
        Arrays.fill(set, freeValue);
    }
    
    public boolean shrink() {
        int newCapacity = targetCapacity(size);
        if (newCapacity < (capacity())) {
            rehash(newCapacity);
            return true;
        } else {
            return false;
        }
    }
    
    @SuppressWarnings(value = "unchecked")
    void allocateArrays(int capacity) {
        _MutableSeparateKVLongLHashSO_allocateArrays(capacity);
        values = ((T[]) (new Object[capacity]));
    }
    
    private void _MutableLHashSeparateKVLongObjMapSO_clear() {
        _MutableSeparateKVLongLHashSO_clear();
        Arrays.fill(values, null);
    }
    
    @Nonnull
    public Object[] toArray() {
        int size = size();
        Object[] result = new Object[size];
        if (size == 0)
            return result;
        
        int resultIndex = 0;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                result[(resultIndex++)] = key;
            }
        }
        return result;
    }
    
    private boolean tryRehashForExpansion(int newCapacity) {
        if (newCapacity > (capacity())) {
            rehash(newCapacity);
            return true;
        } else {
            return false;
        }
    }
    
    public final boolean ensureCapacity(long minSize) {
        int intMinSize = ((int) (Math.min(minSize, ((long) (Integer.MAX_VALUE)))));
        if (minSize < 0L)
            throw new IllegalArgumentException((("Min size should be positive, " + minSize) + " given."));
        
        return (intMinSize > (maxSize)) && (tryRehashForExpansion(targetCapacity(intMinSize)));
    }
    
    @SuppressWarnings(value = "unchecked")
    @Nonnull
    public <T2>  T2[] toArray(@Nonnull
                                      T2[] a) {
        int size = size();
        if ((a.length) < size) {
            Class<?> elementType = a.getClass().getComponentType();
            a = ((T2[]) (Array.newInstance(elementType, size)));
        }
        if (size == 0) {
            if ((a.length) > 0)
                a[0] = null;
            
            return a;
        }
        int resultIndex = 0;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                a[(resultIndex++)] = ((T2) (Long.valueOf(key)));
            }
        }
        if ((a.length) > resultIndex)
            a[resultIndex] = null;
        
        return a;
    }
    
    final void postRemoveHook() {
        (size)--;
    }
    
    final void postInsertHook() {
        if ((++(size)) > (maxSize)) {
            int capacity = capacity();
            if (!(isMaxCapacity(capacity))) {
                rehash((capacity << 1));
            }
        }
    }
    
    private static boolean identical(Object a, Object b) {
        return a == b;
    }
    
    @Nonnull
    public long[] toLongArray() {
        int size = size();
        long[] result = new long[size];
        if (size == 0)
            return result;
        
        int resultIndex = 0;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                result[(resultIndex++)] = key;
            }
        }
        return result;
    }
    
    @SuppressWarnings(value = "unchecked")
    public boolean containsAllEntries(Map<?, ?> m) {
        if (KolobokeLongEntityMap.identical(KolobokeLongEntityMap.this, m))
            throw new IllegalArgumentException();
        
        if (m instanceof LongObjMap) {
            LongObjMap m2 = ((LongObjMap) (m));
            if (m2.valueEquivalence().equals(KolobokeLongEntityMap.this.valueEquivalence())) {
                if ((KolobokeLongEntityMap.this.size()) < (m2.size()))
                    return false;
                
                if ((InternalLongObjMapOps.class.isAssignableFrom(getClass())) && (m2 instanceof InternalLongObjMapOps)) {
                    return ((InternalLongObjMapOps) (m2)).allEntriesContainingIn(((InternalLongObjMapOps<?>) (InternalLongObjMapOps.class.cast(KolobokeLongEntityMap.this))));
                }
            }
            return m2.forEachWhile(new LongObjPredicate() {
                @Override
                public boolean test(long a, Object b) {
                    return containsEntry(a, b);
                }
            });
        }
        for (Map.Entry<?, ?> e : m.entrySet()) {
            if (!(containsEntry(((Long) (e.getKey())), e.getValue())))
                return false;
            
        }
        return true;
    }
    
    boolean doubleSizedArrays() {
        return false;
    }
    
    private int targetCapacity(int size) {
        return LHashCapacities.capacity(configWrapper, size, doubleSizedArrays());
    }
    
    private boolean isMaxCapacity(int capacity) {
        return LHashCapacities.isMaxCapacity(capacity, doubleSizedArrays());
    }
    
    @Nonnull
    public long[] toArray(long[] a) {
        int size = size();
        if ((a.length) < size)
            a = new long[size];
        
        if (size == 0) {
            if ((a.length) > 0)
                a[0] = 0L;
            
            return a;
        }
        int resultIndex = 0;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                a[(resultIndex++)] = key;
            }
        }
        if ((a.length) > resultIndex)
            a[resultIndex] = 0L;
        
        return a;
    }
    
    public int setHashCode() {
        int hashCode = 0;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                hashCode += ((int) (key ^ (key >>> 32)));
            }
        }
        return hashCode;
    }
    
    public String setToString() {
        if (KolobokeLongEntityMap.this.isEmpty())
            return "[]";
        
        StringBuilder sb = new StringBuilder();
        int elementCount = 0;
        long free = freeValue;
        long[] keys = set;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                sb.append(' ').append(key).append(',');
                if ((++elementCount) == 8) {
                    int expectedLength = (sb.length()) * ((size()) / 8);
                    sb.ensureCapacity((expectedLength + (expectedLength / 2)));
                }
            }
        }
        sb.setCharAt(0, '[');
        sb.setCharAt(((sb.length()) - 1), ']');
        return sb.toString();
    }
    
    @Override
    @Nonnull
    public HashObjSet<Map.Entry<Long, T>> entrySet() {
        return new EntryView();
    }
    
    @Override
    @Nonnull
    public ObjCollection<T> values() {
        return new ValueView();
    }
    
    @Override
    public boolean equals(Object o) {
        if ((KolobokeLongEntityMap.this) == o) {
            return true;
        }
        if (!(o instanceof Map)) {
            return false;
        }
        Map<?, ?> that = ((Map<?, ?>) (o));
        if ((that.size()) != (KolobokeLongEntityMap.this.size())) {
            return false;
        }
        try {
            return KolobokeLongEntityMap.this.containsAllEntries(that);
        } catch (ClassCastException e) {
            return false;
        } catch (NullPointerException e) {
            return false;
        }
    }
    
    @Override
    public int hashCode() {
        int hashCode = 0;
        long free = freeValue;
        long[] keys = set;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                hashCode += ((int) ((key ^ (key >>> 32)))) ^ (nullableValueHashCode(vals[i]));
            }
        }
        return hashCode;
    }
    
    void rehash(int newCapacity) {
        long free = freeValue;
        long[] keys = set;
        T[] vals = values;
        initForRehash(newCapacity);
        long[] newKeys = set;
        int capacityMask = (newKeys.length) - 1;
        T[] newVals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                int index;
                if ((newKeys[(index = (LHash.SeparateKVLongKeyMixing.mix(key)) & capacityMask)]) != free) {
                    while (true) {
                        if ((newKeys[(index = (index - 1) & capacityMask)]) == free) {
                            break;
                        }
                    }
                }
                newKeys[index] = key;
                newVals[index] = vals[i];
            }
        }
    }
    
    @Override
    public T put(Long key, T value) {
        int index = insert(key, value);
        if (index < 0) {
            return null;
        } else {
            T[] vals = values;
            T prevValue = vals[index];
            vals[index] = value;
            return prevValue;
        }
    }
    
    @Override
    public T put(long key, T value) {
        int index = insert(key, value);
        if (index < 0) {
            return null;
        } else {
            T[] vals = values;
            T prevValue = vals[index];
            vals[index] = value;
            return prevValue;
        }
    }
    
    public void justPut(long key, T value) {
        int index = insert(key, value);
        if (index < 0) {
            return ;
        } else {
            values[index] = value;
            return ;
        }
    }
    
    class NoRemovedIterator implements LongIterator {
        long[] keys;
        
        final long free;
        
        final int capacityMask;
        
        int index = -1;
        
        int nextIndex;
        
        long next;
        
        NoRemovedIterator() {
            long[] keys = KolobokeLongEntityMap.NoRemovedIterator.this.keys = set;
            capacityMask = (keys.length) - 1;
            long free = this.free = freeValue;
            int nextI = keys.length;
            while ((--nextI) >= 0) {
                long key;
                if ((key = keys[nextI]) != free) {
                    next = key;
                    break;
                }
            }
            nextIndex = nextI;
        }
        
        @Override
        public long nextLong() {
            int nextI;
            if ((nextI = nextIndex) >= 0) {
                index = nextI;
                long[] keys = KolobokeLongEntityMap.NoRemovedIterator.this.keys;
                long free = KolobokeLongEntityMap.NoRemovedIterator.this.free;
                long prev = next;
                while ((--nextI) >= 0) {
                    long key;
                    if ((key = keys[nextI]) != free) {
                        next = key;
                        break;
                    }
                }
                nextIndex = nextI;
                return prev;
            } else {
                throw new NoSuchElementException();
            }
        }
        
        @Override
        public void forEachRemaining(Consumer<? super Long> action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedIterator.this.keys;
            long free = KolobokeLongEntityMap.NoRemovedIterator.this.free;
            int nextI = nextIndex;
            for (int i = nextI; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    action.accept(key);
                }
            }
            if (nextI != (nextIndex)) {
                throw new ConcurrentModificationException();
            }
            index = nextIndex = -1;
        }
        
        @Override
        public void forEachRemaining(LongConsumer action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedIterator.this.keys;
            long free = KolobokeLongEntityMap.NoRemovedIterator.this.free;
            int nextI = nextIndex;
            for (int i = nextI; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    action.accept(key);
                }
            }
            if (nextI != (nextIndex)) {
                throw new ConcurrentModificationException();
            }
            index = nextIndex = -1;
        }
        
        @Override
        public boolean hasNext() {
            return (nextIndex) >= 0;
        }
        
        @Override
        public Long next() {
            return nextLong();
        }
        
        @Override
        public void remove() {
            int index;
            if ((index = KolobokeLongEntityMap.NoRemovedIterator.this.index) >= 0) {
                KolobokeLongEntityMap.NoRemovedIterator.this.index = -1;
                long[] keys = KolobokeLongEntityMap.NoRemovedIterator.this.keys;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedIterator.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == (free)) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedIterator.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = (nextIndex) + 1) > 0) {
                                        KolobokeLongEntityMap.NoRemovedIterator.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedIterator.this.keys[indexToRemove] = free;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedIterator.this.nextIndex = index;
                                    if (indexToShift < (index - 1)) {
                                        KolobokeLongEntityMap.NoRemovedIterator.this.next = keyToShift;
                                    }
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    postRemoveHook();
                } else {
                    justRemove(keys[index]);
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    @Override
    public void putAll(@Nonnull
                               Map<? extends Long, ? extends T> m) {
        if (KolobokeLongEntityMap.identical(KolobokeLongEntityMap.this, m))
            throw new IllegalArgumentException();
        
        long maxPossibleSize = (sizeAsLong()) + (Containers.sizeAsLong(m));
        ensureCapacity(maxPossibleSize);
        if (m instanceof LongObjMap) {
            if ((InternalLongObjMapOps.class.isAssignableFrom(getClass())) && (m instanceof InternalLongObjMapOps)) {
                ((InternalLongObjMapOps) (m)).reversePutAllTo(((InternalLongObjMapOps<? super T>) (InternalLongObjMapOps.class.cast(KolobokeLongEntityMap.this))));
            } else {
                ((LongObjMap) (m)).forEach(new LongObjConsumer<T>() {
                    @Override
                    public void accept(long key, T value) {
                        justPut(key, value);
                    }
                });
            }
        } else {
            for (Map.Entry<? extends Long, ? extends T> e : m.entrySet()) {
                justPut(e.getKey(), e.getValue());
            }
        }
    }
    
    class NoRemovedCursor implements LongCursor {
        long[] keys;
        
        final long free;
        
        final int capacityMask;
        
        int index;
        
        long curKey;
        
        NoRemovedCursor() {
            long[] keys = KolobokeLongEntityMap.NoRemovedCursor.this.keys = set;
            capacityMask = (keys.length) - 1;
            index = keys.length;
            long free = this.free = freeValue;
            curKey = free;
        }
        
        @Override
        public void forEachForward(LongConsumer action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedCursor.this.keys;
            long free = KolobokeLongEntityMap.NoRemovedCursor.this.free;
            int index = KolobokeLongEntityMap.NoRemovedCursor.this.index;
            for (int i = index - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    action.accept(key);
                }
            }
            if (index != (KolobokeLongEntityMap.NoRemovedCursor.this.index)) {
                throw new ConcurrentModificationException();
            }
            KolobokeLongEntityMap.NoRemovedCursor.this.index = -1;
            curKey = free;
        }
        
        @Override
        public long elem() {
            long curKey;
            if ((curKey = KolobokeLongEntityMap.NoRemovedCursor.this.curKey) != (free)) {
                return curKey;
            } else {
                throw new IllegalStateException();
            }
        }
        
        @Override
        public boolean moveNext() {
            long[] keys = KolobokeLongEntityMap.NoRemovedCursor.this.keys;
            long free = KolobokeLongEntityMap.NoRemovedCursor.this.free;
            for (int i = (index) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    index = i;
                    curKey = key;
                    return true;
                }
            }
            curKey = free;
            index = -1;
            return false;
        }
        
        @Override
        public void remove() {
            long curKey;
            long free;
            if ((curKey = KolobokeLongEntityMap.NoRemovedCursor.this.curKey) != (free = KolobokeLongEntityMap.NoRemovedCursor.this.free)) {
                KolobokeLongEntityMap.NoRemovedCursor.this.curKey = free;
                int index = KolobokeLongEntityMap.NoRemovedCursor.this.index;
                long[] keys = KolobokeLongEntityMap.NoRemovedCursor.this.keys;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedCursor.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == free) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedCursor.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = index) > 0) {
                                        KolobokeLongEntityMap.NoRemovedCursor.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedCursor.this.keys[indexToRemove] = free;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedCursor.this.index = ++index;
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    postRemoveHook();
                } else {
                    justRemove(curKey);
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    @Override
    public void clear() {
        doClear();
    }
    
    private void doClear() {
        _MutableLHashSeparateKVLongObjMapSO_clear();
    }
    
    void removeAt(int index) {
        long free = freeValue;
        long[] keys = set;
        T[] vals = values;
        int capacityMask = (keys.length) - 1;
        int indexToRemove = index;
        int indexToShift = indexToRemove;
        int shiftDistance = 1;
        while (true) {
            indexToShift = (indexToShift - 1) & capacityMask;
            long keyToShift;
            if ((keyToShift = keys[indexToShift]) == free) {
                break;
            }
            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                keys[indexToRemove] = keyToShift;
                vals[indexToRemove] = vals[indexToShift];
                indexToRemove = indexToShift;
                shiftDistance = 1;
            } else {
                shiftDistance++;
                if (indexToShift == (1 + index)) {
                    throw new ConcurrentModificationException();
                }
            }
        }
        keys[indexToRemove] = free;
        vals[indexToRemove] = null;
        postRemoveHook();
    }
    
    @Override
    public T remove(Object key) {
        long k = ((Long) (key));
        long free;
        if (k != (free = freeValue)) {
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int index;
            long cur;
            keyPresent : if ((cur = keys[(index = (LHash.SeparateKVLongKeyMixing.mix(k)) & capacityMask)]) != k) {
                if (cur == free) {
                    return null;
                } else {
                    while (true) {
                        if ((cur = keys[(index = (index - 1) & capacityMask)]) == k) {
                            break keyPresent;
                        } else if (cur == free) {
                            return null;
                        }
                    }
                }
            }
            T[] vals = values;
            T val = vals[index];
            int indexToRemove = index;
            int indexToShift = indexToRemove;
            int shiftDistance = 1;
            while (true) {
                indexToShift = (indexToShift - 1) & capacityMask;
                long keyToShift;
                if ((keyToShift = keys[indexToShift]) == free) {
                    break;
                }
                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                    keys[indexToRemove] = keyToShift;
                    vals[indexToRemove] = vals[indexToShift];
                    indexToRemove = indexToShift;
                    shiftDistance = 1;
                } else {
                    shiftDistance++;
                    if (indexToShift == (1 + index)) {
                        throw new ConcurrentModificationException();
                    }
                }
            }
            keys[indexToRemove] = free;
            vals[indexToRemove] = null;
            postRemoveHook();
            return val;
        } else {
            return null;
        }
    }
    
    public boolean justRemove(long key) {
        long free;
        if (key != (free = freeValue)) {
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int index;
            long cur;
            keyPresent : if ((cur = keys[(index = (LHash.SeparateKVLongKeyMixing.mix(key)) & capacityMask)]) != key) {
                if (cur == free) {
                    return false;
                } else {
                    while (true) {
                        if ((cur = keys[(index = (index - 1) & capacityMask)]) == key) {
                            break keyPresent;
                        } else if (cur == free) {
                            return false;
                        }
                    }
                }
            }
            T[] vals = values;
            int indexToRemove = index;
            int indexToShift = indexToRemove;
            int shiftDistance = 1;
            while (true) {
                indexToShift = (indexToShift - 1) & capacityMask;
                long keyToShift;
                if ((keyToShift = keys[indexToShift]) == free) {
                    break;
                }
                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                    keys[indexToRemove] = keyToShift;
                    vals[indexToRemove] = vals[indexToShift];
                    indexToRemove = indexToShift;
                    shiftDistance = 1;
                } else {
                    shiftDistance++;
                    if (indexToShift == (1 + index)) {
                        throw new ConcurrentModificationException();
                    }
                }
            }
            keys[indexToRemove] = free;
            vals[indexToRemove] = null;
            postRemoveHook();
            return true;
        } else {
            return false;
        }
    }
    
    @Override
    public T remove(long key) {
        long free;
        if (key != (free = freeValue)) {
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int index;
            long cur;
            keyPresent : if ((cur = keys[(index = (LHash.SeparateKVLongKeyMixing.mix(key)) & capacityMask)]) != key) {
                if (cur == free) {
                    return null;
                } else {
                    while (true) {
                        if ((cur = keys[(index = (index - 1) & capacityMask)]) == key) {
                            break keyPresent;
                        } else if (cur == free) {
                            return null;
                        }
                    }
                }
            }
            T[] vals = values;
            T val = vals[index];
            int indexToRemove = index;
            int indexToShift = indexToRemove;
            int shiftDistance = 1;
            while (true) {
                indexToShift = (indexToShift - 1) & capacityMask;
                long keyToShift;
                if ((keyToShift = keys[indexToShift]) == free) {
                    break;
                }
                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                    keys[indexToRemove] = keyToShift;
                    vals[indexToRemove] = vals[indexToShift];
                    indexToRemove = indexToShift;
                    shiftDistance = 1;
                } else {
                    shiftDistance++;
                    if (indexToShift == (1 + index)) {
                        throw new ConcurrentModificationException();
                    }
                }
            }
            keys[indexToRemove] = free;
            vals[indexToRemove] = null;
            postRemoveHook();
            return val;
        } else {
            return null;
        }
    }
    
    public boolean remove(long key, Object value) {
        long free;
        if (key != (free = freeValue)) {
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int index;
            long cur;
            keyPresent : if ((cur = keys[(index = (LHash.SeparateKVLongKeyMixing.mix(key)) & capacityMask)]) != key) {
                if (cur == free) {
                    return false;
                } else {
                    while (true) {
                        if ((cur = keys[(index = (index - 1) & capacityMask)]) == key) {
                            break keyPresent;
                        } else if (cur == free) {
                            return false;
                        }
                    }
                }
            }
            T[] vals = values;
            if (nullableValueEquals(vals[index], ((T) (value)))) {
                int indexToRemove = index;
                int indexToShift = indexToRemove;
                int shiftDistance = 1;
                while (true) {
                    indexToShift = (indexToShift - 1) & capacityMask;
                    long keyToShift;
                    if ((keyToShift = keys[indexToShift]) == free) {
                        break;
                    }
                    if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                        keys[indexToRemove] = keyToShift;
                        vals[indexToRemove] = vals[indexToShift];
                        indexToRemove = indexToShift;
                        shiftDistance = 1;
                    } else {
                        shiftDistance++;
                        if (indexToShift == (1 + index)) {
                            throw new ConcurrentModificationException();
                        }
                    }
                }
                keys[indexToRemove] = free;
                vals[indexToRemove] = null;
                postRemoveHook();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    
    public boolean removeIf(Predicate<? super Long> filter) {
        if (filter == null)
            throw new NullPointerException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return false;
        
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        int capacityMask = (keys.length) - 1;
        int firstDelayedRemoved = -1;
        long delayedRemoved = 0L;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (filter.test(key)) {
                    closeDeletion : if (firstDelayedRemoved < 0) {
                        int indexToRemove = i;
                        int indexToShift = indexToRemove;
                        int shiftDistance = 1;
                        while (true) {
                            indexToShift = (indexToShift - 1) & capacityMask;
                            long keyToShift;
                            if ((keyToShift = keys[indexToShift]) == free) {
                                break;
                            }
                            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                if (indexToShift > indexToRemove) {
                                    firstDelayedRemoved = i;
                                    delayedRemoved = key;
                                    keys[indexToRemove] = key;
                                    break closeDeletion;
                                }
                                if (indexToRemove == i) {
                                    i++;
                                }
                                keys[indexToRemove] = keyToShift;
                                vals[indexToRemove] = vals[indexToShift];
                                indexToRemove = indexToShift;
                                shiftDistance = 1;
                            } else {
                                shiftDistance++;
                                if (indexToShift == (1 + i)) {
                                    throw new ConcurrentModificationException();
                                }
                            }
                        }
                        keys[indexToRemove] = free;
                        vals[indexToRemove] = null;
                        postRemoveHook();
                    } else {
                        keys[i] = delayedRemoved;
                    }
                    changed = true;
                }
            }
        }
        if (firstDelayedRemoved >= 0) {
            closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
        }
        return changed;
    }
    
    public boolean removeIf(LongPredicate filter) {
        if (filter == null)
            throw new NullPointerException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return false;
        
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        int capacityMask = (keys.length) - 1;
        int firstDelayedRemoved = -1;
        long delayedRemoved = 0L;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (filter.test(key)) {
                    closeDeletion : if (firstDelayedRemoved < 0) {
                        int indexToRemove = i;
                        int indexToShift = indexToRemove;
                        int shiftDistance = 1;
                        while (true) {
                            indexToShift = (indexToShift - 1) & capacityMask;
                            long keyToShift;
                            if ((keyToShift = keys[indexToShift]) == free) {
                                break;
                            }
                            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                if (indexToShift > indexToRemove) {
                                    firstDelayedRemoved = i;
                                    delayedRemoved = key;
                                    keys[indexToRemove] = key;
                                    break closeDeletion;
                                }
                                if (indexToRemove == i) {
                                    i++;
                                }
                                keys[indexToRemove] = keyToShift;
                                vals[indexToRemove] = vals[indexToShift];
                                indexToRemove = indexToShift;
                                shiftDistance = 1;
                            } else {
                                shiftDistance++;
                                if (indexToShift == (1 + i)) {
                                    throw new ConcurrentModificationException();
                                }
                            }
                        }
                        keys[indexToRemove] = free;
                        vals[indexToRemove] = null;
                        postRemoveHook();
                    } else {
                        keys[i] = delayedRemoved;
                    }
                    changed = true;
                }
            }
        }
        if (firstDelayedRemoved >= 0) {
            closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
        }
        return changed;
    }
    
    public boolean removeAll(@Nonnull
                                     HashLongSet thisC, @Nonnull
                                     Collection<?> c) {
        if (thisC == ((Object) (c)))
            throw new IllegalArgumentException();
        
        if ((KolobokeLongEntityMap.this.isEmpty()) || (c.isEmpty()))
            return false;
        
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        int capacityMask = (keys.length) - 1;
        int firstDelayedRemoved = -1;
        long delayedRemoved = 0L;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (c.contains(key)) {
                    closeDeletion : if (firstDelayedRemoved < 0) {
                        int indexToRemove = i;
                        int indexToShift = indexToRemove;
                        int shiftDistance = 1;
                        while (true) {
                            indexToShift = (indexToShift - 1) & capacityMask;
                            long keyToShift;
                            if ((keyToShift = keys[indexToShift]) == free) {
                                break;
                            }
                            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                if (indexToShift > indexToRemove) {
                                    firstDelayedRemoved = i;
                                    delayedRemoved = key;
                                    keys[indexToRemove] = key;
                                    break closeDeletion;
                                }
                                if (indexToRemove == i) {
                                    i++;
                                }
                                keys[indexToRemove] = keyToShift;
                                vals[indexToRemove] = vals[indexToShift];
                                indexToRemove = indexToShift;
                                shiftDistance = 1;
                            } else {
                                shiftDistance++;
                                if (indexToShift == (1 + i)) {
                                    throw new ConcurrentModificationException();
                                }
                            }
                        }
                        keys[indexToRemove] = free;
                        vals[indexToRemove] = null;
                        postRemoveHook();
                    } else {
                        keys[i] = delayedRemoved;
                    }
                    changed = true;
                }
            }
        }
        if (firstDelayedRemoved >= 0) {
            closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
        }
        return changed;
    }
    
    boolean removeAll(@Nonnull
                              HashLongSet thisC, @Nonnull
                              LongCollection c) {
        if (thisC == ((Object) (c)))
            throw new IllegalArgumentException();
        
        if ((KolobokeLongEntityMap.this.isEmpty()) || (c.isEmpty()))
            return false;
        
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        int capacityMask = (keys.length) - 1;
        int firstDelayedRemoved = -1;
        long delayedRemoved = 0L;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (c.contains(key)) {
                    closeDeletion : if (firstDelayedRemoved < 0) {
                        int indexToRemove = i;
                        int indexToShift = indexToRemove;
                        int shiftDistance = 1;
                        while (true) {
                            indexToShift = (indexToShift - 1) & capacityMask;
                            long keyToShift;
                            if ((keyToShift = keys[indexToShift]) == free) {
                                break;
                            }
                            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                if (indexToShift > indexToRemove) {
                                    firstDelayedRemoved = i;
                                    delayedRemoved = key;
                                    keys[indexToRemove] = key;
                                    break closeDeletion;
                                }
                                if (indexToRemove == i) {
                                    i++;
                                }
                                keys[indexToRemove] = keyToShift;
                                vals[indexToRemove] = vals[indexToShift];
                                indexToRemove = indexToShift;
                                shiftDistance = 1;
                            } else {
                                shiftDistance++;
                                if (indexToShift == (1 + i)) {
                                    throw new ConcurrentModificationException();
                                }
                            }
                        }
                        keys[indexToRemove] = free;
                        vals[indexToRemove] = null;
                        postRemoveHook();
                    } else {
                        keys[i] = delayedRemoved;
                    }
                    changed = true;
                }
            }
        }
        if (firstDelayedRemoved >= 0) {
            closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
        }
        return changed;
    }
    
    public boolean retainAll(@Nonnull
                                     HashLongSet thisC, @Nonnull
                                     Collection<?> c) {
        if (c instanceof LongCollection)
            return retainAll(thisC, ((LongCollection) (c)));
        
        if (thisC == ((Object) (c)))
            throw new IllegalArgumentException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return false;
        
        if (c.isEmpty()) {
            clear();
            return true;
        }
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        int capacityMask = (keys.length) - 1;
        int firstDelayedRemoved = -1;
        long delayedRemoved = 0L;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (!(c.contains(key))) {
                    closeDeletion : if (firstDelayedRemoved < 0) {
                        int indexToRemove = i;
                        int indexToShift = indexToRemove;
                        int shiftDistance = 1;
                        while (true) {
                            indexToShift = (indexToShift - 1) & capacityMask;
                            long keyToShift;
                            if ((keyToShift = keys[indexToShift]) == free) {
                                break;
                            }
                            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                if (indexToShift > indexToRemove) {
                                    firstDelayedRemoved = i;
                                    delayedRemoved = key;
                                    keys[indexToRemove] = key;
                                    break closeDeletion;
                                }
                                if (indexToRemove == i) {
                                    i++;
                                }
                                keys[indexToRemove] = keyToShift;
                                vals[indexToRemove] = vals[indexToShift];
                                indexToRemove = indexToShift;
                                shiftDistance = 1;
                            } else {
                                shiftDistance++;
                                if (indexToShift == (1 + i)) {
                                    throw new ConcurrentModificationException();
                                }
                            }
                        }
                        keys[indexToRemove] = free;
                        vals[indexToRemove] = null;
                        postRemoveHook();
                    } else {
                        keys[i] = delayedRemoved;
                    }
                    changed = true;
                }
            }
        }
        if (firstDelayedRemoved >= 0) {
            closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
        }
        return changed;
    }
    
    private boolean retainAll(@Nonnull
                                      HashLongSet thisC, @Nonnull
                                      LongCollection c) {
        if (thisC == ((Object) (c)))
            throw new IllegalArgumentException();
        
        if (KolobokeLongEntityMap.this.isEmpty())
            return false;
        
        if (c.isEmpty()) {
            clear();
            return true;
        }
        boolean changed = false;
        long free = freeValue;
        long[] keys = set;
        int capacityMask = (keys.length) - 1;
        int firstDelayedRemoved = -1;
        long delayedRemoved = 0L;
        T[] vals = values;
        for (int i = (keys.length) - 1; i >= 0; i--) {
            long key;
            if ((key = keys[i]) != free) {
                if (!(c.contains(key))) {
                    closeDeletion : if (firstDelayedRemoved < 0) {
                        int indexToRemove = i;
                        int indexToShift = indexToRemove;
                        int shiftDistance = 1;
                        while (true) {
                            indexToShift = (indexToShift - 1) & capacityMask;
                            long keyToShift;
                            if ((keyToShift = keys[indexToShift]) == free) {
                                break;
                            }
                            if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                if (indexToShift > indexToRemove) {
                                    firstDelayedRemoved = i;
                                    delayedRemoved = key;
                                    keys[indexToRemove] = key;
                                    break closeDeletion;
                                }
                                if (indexToRemove == i) {
                                    i++;
                                }
                                keys[indexToRemove] = keyToShift;
                                vals[indexToRemove] = vals[indexToShift];
                                indexToRemove = indexToShift;
                                shiftDistance = 1;
                            } else {
                                shiftDistance++;
                                if (indexToShift == (1 + i)) {
                                    throw new ConcurrentModificationException();
                                }
                            }
                        }
                        keys[indexToRemove] = free;
                        vals[indexToRemove] = null;
                        postRemoveHook();
                    } else {
                        keys[i] = delayedRemoved;
                    }
                    changed = true;
                }
            }
        }
        if (firstDelayedRemoved >= 0) {
            closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
        }
        return changed;
    }
    
    void closeDelayedRemoved(int firstDelayedRemoved, long delayedRemoved) {
        long free = freeValue;
        long[] keys = set;
        T[] vals = values;
        int capacityMask = (keys.length) - 1;
        for (int i = firstDelayedRemoved; i >= 0; i--) {
            if ((keys[i]) == delayedRemoved) {
                int indexToRemove = i;
                int indexToShift = indexToRemove;
                int shiftDistance = 1;
                while (true) {
                    indexToShift = (indexToShift - 1) & capacityMask;
                    long keyToShift;
                    if ((keyToShift = keys[indexToShift]) == free) {
                        break;
                    }
                    if ((keyToShift != delayedRemoved) && ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance)) {
                        keys[indexToRemove] = keyToShift;
                        vals[indexToRemove] = vals[indexToShift];
                        indexToRemove = indexToShift;
                        shiftDistance = 1;
                    } else {
                        shiftDistance++;
                        if (indexToShift == (1 + i)) {
                            throw new ConcurrentModificationException();
                        }
                    }
                }
                keys[indexToRemove] = free;
                vals[indexToRemove] = null;
                postRemoveHook();
            }
        }
    }
    
    public LongIterator iterator() {
        return new NoRemovedKeyIterator();
    }
    
    public LongCursor setCursor() {
        return new NoRemovedKeyCursor();
    }
    
    class NoRemovedKeyIterator extends KolobokeLongEntityMap.NoRemovedIterator {
        T[] vals;
        
        private NoRemovedKeyIterator() {
            super();
            vals = values;
        }
        
        @Override
        public void remove() {
            int index;
            if ((index = KolobokeLongEntityMap.NoRemovedKeyIterator.this.index) >= 0) {
                KolobokeLongEntityMap.NoRemovedKeyIterator.this.index = -1;
                long[] keys = KolobokeLongEntityMap.NoRemovedKeyIterator.this.keys;
                T[] vals = KolobokeLongEntityMap.NoRemovedKeyIterator.this.vals;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedKeyIterator.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == (free)) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedKeyIterator.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = (nextIndex) + 1) > 0) {
                                        KolobokeLongEntityMap.NoRemovedKeyIterator.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        KolobokeLongEntityMap.NoRemovedKeyIterator.this.vals = Arrays.copyOf(vals, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedKeyIterator.this.keys[indexToRemove] = free;
                                            KolobokeLongEntityMap.NoRemovedKeyIterator.this.vals[indexToRemove] = null;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedKeyIterator.this.nextIndex = index;
                                    if (indexToShift < (index - 1)) {
                                        KolobokeLongEntityMap.NoRemovedKeyIterator.this.next = keyToShift;
                                    }
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            vals[indexToRemove] = vals[indexToShift];
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    vals[indexToRemove] = null;
                    postRemoveHook();
                } else {
                    justRemove(keys[index]);
                    vals[index] = null;
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    class NoRemovedKeyCursor extends KolobokeLongEntityMap.NoRemovedCursor {
        T[] vals;
        
        private NoRemovedKeyCursor() {
            super();
            vals = values;
        }
        
        @Override
        public void remove() {
            long curKey;
            long free;
            if ((curKey = KolobokeLongEntityMap.NoRemovedKeyCursor.this.curKey) != (free = KolobokeLongEntityMap.NoRemovedKeyCursor.this.free)) {
                KolobokeLongEntityMap.NoRemovedKeyCursor.this.curKey = free;
                int index = KolobokeLongEntityMap.NoRemovedKeyCursor.this.index;
                long[] keys = KolobokeLongEntityMap.NoRemovedKeyCursor.this.keys;
                T[] vals = KolobokeLongEntityMap.NoRemovedKeyCursor.this.vals;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedKeyCursor.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == free) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedKeyCursor.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = index) > 0) {
                                        KolobokeLongEntityMap.NoRemovedKeyCursor.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        KolobokeLongEntityMap.NoRemovedKeyCursor.this.vals = Arrays.copyOf(vals, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedKeyCursor.this.keys[indexToRemove] = free;
                                            KolobokeLongEntityMap.NoRemovedKeyCursor.this.vals[indexToRemove] = null;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedKeyCursor.this.index = ++index;
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            vals[indexToRemove] = vals[indexToShift];
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    vals[indexToRemove] = null;
                    postRemoveHook();
                } else {
                    justRemove(curKey);
                    vals[index] = null;
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    class EntryView extends AbstractSetView<Map.Entry<Long, T>> implements HashObjSet<Map.Entry<Long, T>> , InternalObjCollectionOps<Map.Entry<Long, T>> {
        @Nonnull
        @Override
        public Equivalence<Map.Entry<Long, T>> equivalence() {
            return Equivalence.entryEquivalence(Equivalence.<Long>defaultEquality(), valueEquivalence());
        }
        
        @Nonnull
        @Override
        public HashConfig hashConfig() {
            return KolobokeLongEntityMap.this.hashConfig();
        }
        
        @Override
        public int size() {
            return size;
        }
        
        @Override
        public double currentLoad() {
            return KolobokeLongEntityMap.this.currentLoad();
        }
        
        @Override
        @SuppressWarnings(value = "unchecked")
        public boolean contains(Object o) {
            try {
                Map.Entry<Long, T> e = ((Map.Entry<Long, T>) (o));
                return containsEntry(e.getKey(), e.getValue());
            } catch (NullPointerException e) {
                return false;
            } catch (ClassCastException e) {
                return false;
            }
        }
        
        @Override
        @Nonnull
        public final Object[] toArray() {
            int size = size();
            Object[] result = new Object[size];
            if (size == 0)
                return result;
            
            int resultIndex = 0;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    result[(resultIndex++)] = new MutableEntry(i, key, vals[i]);
                }
            }
            return result;
        }
        
        @Override
        @SuppressWarnings(value = "unchecked")
        @Nonnull
        public final <T2>  T2[] toArray(@Nonnull
                                                T2[] a) {
            int size = size();
            if ((a.length) < size) {
                Class<?> elementType = a.getClass().getComponentType();
                a = ((T2[]) (Array.newInstance(elementType, size)));
            }
            if (size == 0) {
                if ((a.length) > 0)
                    a[0] = null;
                
                return a;
            }
            int resultIndex = 0;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    a[(resultIndex++)] = ((T2) (new MutableEntry(i, key, vals[i])));
                }
            }
            if ((a.length) > resultIndex)
                a[resultIndex] = null;
            
            return a;
        }
        
        @Override
        public final void forEach(@Nonnull
                                          Consumer<? super Map.Entry<Long, T>> action) {
            if (action == null)
                throw new NullPointerException();
            
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return ;
            
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    action.accept(new MutableEntry(i, key, vals[i]));
                }
            }
        }
        
        @Override
        public boolean forEachWhile(@Nonnull
                                            Predicate<? super Map.Entry<Long, T>> predicate) {
            if (predicate == null)
                throw new NullPointerException();
            
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return true;
            
            boolean terminated = false;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (!(predicate.test(new MutableEntry(i, key, vals[i])))) {
                        terminated = true;
                        break;
                    }
                }
            }
            return !terminated;
        }
        
        @Override
        @Nonnull
        public ObjIterator<Map.Entry<Long, T>> iterator() {
            return new NoRemovedEntryIterator();
        }
        
        @Nonnull
        @Override
        public ObjCursor<Map.Entry<Long, T>> cursor() {
            return new NoRemovedEntryCursor();
        }
        
        @Override
        public final boolean containsAll(@Nonnull
                                                 Collection<?> c) {
            return CommonObjCollectionOps.containsAll(KolobokeLongEntityMap.EntryView.this, c);
        }
        
        @Override
        public final boolean allContainingIn(ObjCollection<?> c) {
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return true;
            
            boolean containsAll = true;
            KolobokeLongEntityMap<T>.ReusableEntry e = new ReusableEntry();
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (!(c.contains(e.with(key, vals[i])))) {
                        containsAll = false;
                        break;
                    }
                }
            }
            return containsAll;
        }
        
        @Override
        public boolean reverseRemoveAllFrom(ObjSet<?> s) {
            if ((KolobokeLongEntityMap.EntryView.this.isEmpty()) || (s.isEmpty()))
                return false;
            
            boolean changed = false;
            KolobokeLongEntityMap<T>.ReusableEntry e = new ReusableEntry();
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    changed |= s.remove(e.with(key, vals[i]));
                }
            }
            return changed;
        }
        
        @Override
        public final boolean reverseAddAllTo(ObjCollection<? super Map.Entry<Long, T>> c) {
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return false;
            
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    changed |= c.add(new MutableEntry(i, key, vals[i]));
                }
            }
            return changed;
        }
        
        public int hashCode() {
            return KolobokeLongEntityMap.this.hashCode();
        }
        
        @Override
        public String toString() {
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return "[]";
            
            StringBuilder sb = new StringBuilder();
            int elementCount = 0;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    sb.append(' ');
                    sb.append(key);
                    sb.append('=');
                    Object val = vals[i];
                    sb.append((val != ((Object) (KolobokeLongEntityMap.EntryView.this)) ? val : "(this Collection)"));
                    sb.append(',');
                    if ((++elementCount) == 8) {
                        int expectedLength = (sb.length()) * ((size()) / 8);
                        sb.ensureCapacity((expectedLength + (expectedLength / 2)));
                    }
                }
            }
            sb.setCharAt(0, '[');
            sb.setCharAt(((sb.length()) - 1), ']');
            return sb.toString();
        }
        
        @Override
        public boolean shrink() {
            return KolobokeLongEntityMap.this.shrink();
        }
        
        @Override
        @SuppressWarnings(value = "unchecked")
        public boolean remove(Object o) {
            try {
                Map.Entry<Long, T> e = ((Map.Entry<Long, T>) (o));
                long key = e.getKey();
                T value = e.getValue();
                return KolobokeLongEntityMap.this.remove(key, value);
            } catch (NullPointerException e) {
                return false;
            } catch (ClassCastException e) {
                return false;
            }
        }
        
        @Override
        public final boolean removeIf(@Nonnull
                                              Predicate<? super Map.Entry<Long, T>> filter) {
            if (filter == null)
                throw new NullPointerException();
            
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return false;
            
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int firstDelayedRemoved = -1;
            long delayedRemoved = 0L;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (filter.test(new MutableEntry(i, key, vals[i]))) {
                        closeDeletion : if (firstDelayedRemoved < 0) {
                            int indexToRemove = i;
                            int indexToShift = indexToRemove;
                            int shiftDistance = 1;
                            while (true) {
                                indexToShift = (indexToShift - 1) & capacityMask;
                                long keyToShift;
                                if ((keyToShift = keys[indexToShift]) == free) {
                                    break;
                                }
                                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                    if (indexToShift > indexToRemove) {
                                        firstDelayedRemoved = i;
                                        delayedRemoved = key;
                                        keys[indexToRemove] = key;
                                        break closeDeletion;
                                    }
                                    if (indexToRemove == i) {
                                        i++;
                                    }
                                    keys[indexToRemove] = keyToShift;
                                    vals[indexToRemove] = vals[indexToShift];
                                    indexToRemove = indexToShift;
                                    shiftDistance = 1;
                                } else {
                                    shiftDistance++;
                                    if (indexToShift == (1 + i)) {
                                        throw new ConcurrentModificationException();
                                    }
                                }
                            }
                            keys[indexToRemove] = free;
                            vals[indexToRemove] = null;
                            postRemoveHook();
                        } else {
                            keys[i] = delayedRemoved;
                        }
                        changed = true;
                    }
                }
            }
            if (firstDelayedRemoved >= 0) {
                closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
            }
            return changed;
        }
        
        @SuppressWarnings(value = "unchecked")
        @Override
        public final boolean removeAll(@Nonnull
                                               Collection<?> c) {
            if (c instanceof InternalObjCollectionOps) {
                InternalObjCollectionOps c2 = ((InternalObjCollectionOps) (c));
                if ((equivalence().equals(c2.equivalence())) && ((c2.size()) < (KolobokeLongEntityMap.EntryView.this.size()))) {
                    c2.reverseRemoveAllFrom(KolobokeLongEntityMap.EntryView.this);
                }
            }
            if ((KolobokeLongEntityMap.EntryView.this) == ((Object) (c)))
                throw new IllegalArgumentException();
            
            if ((KolobokeLongEntityMap.EntryView.this.isEmpty()) || (c.isEmpty()))
                return false;
            
            boolean changed = false;
            KolobokeLongEntityMap<T>.ReusableEntry e = new ReusableEntry();
            long free = freeValue;
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int firstDelayedRemoved = -1;
            long delayedRemoved = 0L;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (c.contains(e.with(key, vals[i]))) {
                        closeDeletion : if (firstDelayedRemoved < 0) {
                            int indexToRemove = i;
                            int indexToShift = indexToRemove;
                            int shiftDistance = 1;
                            while (true) {
                                indexToShift = (indexToShift - 1) & capacityMask;
                                long keyToShift;
                                if ((keyToShift = keys[indexToShift]) == free) {
                                    break;
                                }
                                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                    if (indexToShift > indexToRemove) {
                                        firstDelayedRemoved = i;
                                        delayedRemoved = key;
                                        keys[indexToRemove] = key;
                                        break closeDeletion;
                                    }
                                    if (indexToRemove == i) {
                                        i++;
                                    }
                                    keys[indexToRemove] = keyToShift;
                                    vals[indexToRemove] = vals[indexToShift];
                                    indexToRemove = indexToShift;
                                    shiftDistance = 1;
                                } else {
                                    shiftDistance++;
                                    if (indexToShift == (1 + i)) {
                                        throw new ConcurrentModificationException();
                                    }
                                }
                            }
                            keys[indexToRemove] = free;
                            vals[indexToRemove] = null;
                            postRemoveHook();
                        } else {
                            keys[i] = delayedRemoved;
                        }
                        changed = true;
                    }
                }
            }
            if (firstDelayedRemoved >= 0) {
                closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
            }
            return changed;
        }
        
        @Override
        public final boolean retainAll(@Nonnull
                                               Collection<?> c) {
            if ((KolobokeLongEntityMap.EntryView.this) == ((Object) (c)))
                throw new IllegalArgumentException();
            
            if (KolobokeLongEntityMap.EntryView.this.isEmpty())
                return false;
            
            if (c.isEmpty()) {
                clear();
                return true;
            }
            boolean changed = false;
            KolobokeLongEntityMap<T>.ReusableEntry e = new ReusableEntry();
            long free = freeValue;
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int firstDelayedRemoved = -1;
            long delayedRemoved = 0L;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (!(c.contains(e.with(key, vals[i])))) {
                        closeDeletion : if (firstDelayedRemoved < 0) {
                            int indexToRemove = i;
                            int indexToShift = indexToRemove;
                            int shiftDistance = 1;
                            while (true) {
                                indexToShift = (indexToShift - 1) & capacityMask;
                                long keyToShift;
                                if ((keyToShift = keys[indexToShift]) == free) {
                                    break;
                                }
                                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                    if (indexToShift > indexToRemove) {
                                        firstDelayedRemoved = i;
                                        delayedRemoved = key;
                                        keys[indexToRemove] = key;
                                        break closeDeletion;
                                    }
                                    if (indexToRemove == i) {
                                        i++;
                                    }
                                    keys[indexToRemove] = keyToShift;
                                    vals[indexToRemove] = vals[indexToShift];
                                    indexToRemove = indexToShift;
                                    shiftDistance = 1;
                                } else {
                                    shiftDistance++;
                                    if (indexToShift == (1 + i)) {
                                        throw new ConcurrentModificationException();
                                    }
                                }
                            }
                            keys[indexToRemove] = free;
                            vals[indexToRemove] = null;
                            postRemoveHook();
                        } else {
                            keys[i] = delayedRemoved;
                        }
                        changed = true;
                    }
                }
            }
            if (firstDelayedRemoved >= 0) {
                closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
            }
            return changed;
        }
        
        @Override
        public void clear() {
            KolobokeLongEntityMap.this.doClear();
        }
    }
    
    abstract class LongObjEntry extends AbstractEntry<Long, T> {
        abstract long key();
        
        @Override
        public final Long getKey() {
            return key();
        }
        
        abstract T value();
        
        @Override
        public final T getValue() {
            return value();
        }
        
        @SuppressWarnings(value = "unchecked")
        @Override
        public boolean equals(Object o) {
            Map.Entry e2;
            long k2;
            T v2;
            try {
                e2 = ((Map.Entry) (o));
                k2 = ((Long) (e2.getKey()));
                v2 = ((T) (e2.getValue()));
                return ((key()) == k2) && (nullableValueEquals(v2, value()));
            } catch (ClassCastException e) {
                return false;
            } catch (NullPointerException e) {
                return false;
            }
        }
        
        @Override
        public int hashCode() {
            return (Primitives.hashCode(key())) ^ (nullableValueHashCode(value()));
        }
    }
    
    class MutableEntry extends KolobokeLongEntityMap<T>.LongObjEntry {
        private final int index;
        
        final long key;
        
        private T value;
        
        MutableEntry(int index, long key, T value) {
            this.index = index;
            this.key = key;
            KolobokeLongEntityMap.MutableEntry.this.value = value;
        }
        
        @Override
        public long key() {
            return key;
        }
        
        @Override
        public T value() {
            return value;
        }
        
        @Override
        public T setValue(T newValue) {
            T oldValue = value;
            T unwrappedNewValue = newValue;
            value = unwrappedNewValue;
            updateValueInTable(unwrappedNewValue);
            return oldValue;
        }
        
        void updateValueInTable(T newValue) {
            values[index] = newValue;
        }
    }
    
    class ReusableEntry extends KolobokeLongEntityMap<T>.LongObjEntry {
        private long key;
        
        private T value;
        
        KolobokeLongEntityMap<T>.ReusableEntry with(long key, T value) {
            KolobokeLongEntityMap.ReusableEntry.this.key = key;
            KolobokeLongEntityMap.ReusableEntry.this.value = value;
            return KolobokeLongEntityMap.ReusableEntry.this;
        }
        
        @Override
        public long key() {
            return key;
        }
        
        @Override
        public T value() {
            return value;
        }
    }
    
    class ValueView extends AbstractObjValueView<T> {
        @Override
        public Equivalence<T> equivalence() {
            return valueEquivalence();
        }
        
        @Override
        public int size() {
            return KolobokeLongEntityMap.this.size();
        }
        
        @Override
        public boolean shrink() {
            return KolobokeLongEntityMap.this.shrink();
        }
        
        @Override
        public boolean contains(Object o) {
            return KolobokeLongEntityMap.this.containsValue(o);
        }
        
        @Override
        public void forEach(Consumer<? super T> action) {
            if (action == null)
                throw new NullPointerException();
            
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return ;
            
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    action.accept(vals[i]);
                }
            }
        }
        
        @Override
        public boolean forEachWhile(Predicate<? super T> predicate) {
            if (predicate == null)
                throw new NullPointerException();
            
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return true;
            
            boolean terminated = false;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    if (!(predicate.test(vals[i]))) {
                        terminated = true;
                        break;
                    }
                }
            }
            return !terminated;
        }
        
        @Override
        public boolean allContainingIn(ObjCollection<?> c) {
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return true;
            
            boolean containsAll = true;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    if (!(c.contains(vals[i]))) {
                        containsAll = false;
                        break;
                    }
                }
            }
            return containsAll;
        }
        
        @Override
        public boolean reverseAddAllTo(ObjCollection<? super T> c) {
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return false;
            
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    changed |= c.add(vals[i]);
                }
            }
            return changed;
        }
        
        @Override
        public boolean reverseRemoveAllFrom(ObjSet<?> s) {
            if ((KolobokeLongEntityMap.ValueView.this.isEmpty()) || (s.isEmpty()))
                return false;
            
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    changed |= s.remove(vals[i]);
                }
            }
            return changed;
        }
        
        @Override
        @Nonnull
        public ObjIterator<T> iterator() {
            return new NoRemovedValueIterator();
        }
        
        @Nonnull
        @Override
        public ObjCursor<T> cursor() {
            return new NoRemovedValueCursor();
        }
        
        @Override
        @Nonnull
        public Object[] toArray() {
            int size = size();
            Object[] result = new Object[size];
            if (size == 0)
                return result;
            
            int resultIndex = 0;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    result[(resultIndex++)] = vals[i];
                }
            }
            return result;
        }
        
        @Override
        @SuppressWarnings(value = "unchecked")
        @Nonnull
        public <T2>  T2[] toArray(@Nonnull
                                          T2[] a) {
            int size = size();
            if ((a.length) < size) {
                Class<?> elementType = a.getClass().getComponentType();
                a = ((T2[]) (Array.newInstance(elementType, size)));
            }
            if (size == 0) {
                if ((a.length) > 0)
                    a[0] = null;
                
                return a;
            }
            int resultIndex = 0;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    a[(resultIndex++)] = ((T2) (vals[i]));
                }
            }
            if ((a.length) > resultIndex)
                a[resultIndex] = null;
            
            return a;
        }
        
        @Override
        public String toString() {
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return "[]";
            
            StringBuilder sb = new StringBuilder();
            int elementCount = 0;
            long free = freeValue;
            long[] keys = set;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    T val;
                    sb.append(' ').append(((val = vals[i]) != ((Object) (KolobokeLongEntityMap.ValueView.this)) ? val : "(this Collection)")).append(',');
                    if ((++elementCount) == 8) {
                        int expectedLength = (sb.length()) * ((size()) / 8);
                        sb.ensureCapacity((expectedLength + (expectedLength / 2)));
                    }
                }
            }
            sb.setCharAt(0, '[');
            sb.setCharAt(((sb.length()) - 1), ']');
            return sb.toString();
        }
        
        @Override
        public boolean remove(Object o) {
            return removeValue(o);
        }
        
        @Override
        public void clear() {
            KolobokeLongEntityMap.this.clear();
        }
        
        @Override
        public boolean removeIf(Predicate<? super T> filter) {
            if (filter == null)
                throw new NullPointerException();
            
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return false;
            
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int firstDelayedRemoved = -1;
            long delayedRemoved = 0L;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (filter.test(vals[i])) {
                        closeDeletion : if (firstDelayedRemoved < 0) {
                            int indexToRemove = i;
                            int indexToShift = indexToRemove;
                            int shiftDistance = 1;
                            while (true) {
                                indexToShift = (indexToShift - 1) & capacityMask;
                                long keyToShift;
                                if ((keyToShift = keys[indexToShift]) == free) {
                                    break;
                                }
                                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                    if (indexToShift > indexToRemove) {
                                        firstDelayedRemoved = i;
                                        delayedRemoved = key;
                                        keys[indexToRemove] = key;
                                        break closeDeletion;
                                    }
                                    if (indexToRemove == i) {
                                        i++;
                                    }
                                    keys[indexToRemove] = keyToShift;
                                    vals[indexToRemove] = vals[indexToShift];
                                    indexToRemove = indexToShift;
                                    shiftDistance = 1;
                                } else {
                                    shiftDistance++;
                                    if (indexToShift == (1 + i)) {
                                        throw new ConcurrentModificationException();
                                    }
                                }
                            }
                            keys[indexToRemove] = free;
                            vals[indexToRemove] = null;
                            postRemoveHook();
                        } else {
                            keys[i] = delayedRemoved;
                        }
                        changed = true;
                    }
                }
            }
            if (firstDelayedRemoved >= 0) {
                closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
            }
            return changed;
        }
        
        @Override
        public boolean removeAll(@Nonnull
                                         Collection<?> c) {
            if ((KolobokeLongEntityMap.ValueView.this) == ((Object) (c)))
                throw new IllegalArgumentException();
            
            if ((KolobokeLongEntityMap.ValueView.this.isEmpty()) || (c.isEmpty()))
                return false;
            
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int firstDelayedRemoved = -1;
            long delayedRemoved = 0L;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (c.contains(vals[i])) {
                        closeDeletion : if (firstDelayedRemoved < 0) {
                            int indexToRemove = i;
                            int indexToShift = indexToRemove;
                            int shiftDistance = 1;
                            while (true) {
                                indexToShift = (indexToShift - 1) & capacityMask;
                                long keyToShift;
                                if ((keyToShift = keys[indexToShift]) == free) {
                                    break;
                                }
                                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                    if (indexToShift > indexToRemove) {
                                        firstDelayedRemoved = i;
                                        delayedRemoved = key;
                                        keys[indexToRemove] = key;
                                        break closeDeletion;
                                    }
                                    if (indexToRemove == i) {
                                        i++;
                                    }
                                    keys[indexToRemove] = keyToShift;
                                    vals[indexToRemove] = vals[indexToShift];
                                    indexToRemove = indexToShift;
                                    shiftDistance = 1;
                                } else {
                                    shiftDistance++;
                                    if (indexToShift == (1 + i)) {
                                        throw new ConcurrentModificationException();
                                    }
                                }
                            }
                            keys[indexToRemove] = free;
                            vals[indexToRemove] = null;
                            postRemoveHook();
                        } else {
                            keys[i] = delayedRemoved;
                        }
                        changed = true;
                    }
                }
            }
            if (firstDelayedRemoved >= 0) {
                closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
            }
            return changed;
        }
        
        @Override
        public boolean retainAll(@Nonnull
                                         Collection<?> c) {
            if ((KolobokeLongEntityMap.ValueView.this) == ((Object) (c)))
                throw new IllegalArgumentException();
            
            if (KolobokeLongEntityMap.ValueView.this.isEmpty())
                return false;
            
            if (c.isEmpty()) {
                clear();
                return true;
            }
            boolean changed = false;
            long free = freeValue;
            long[] keys = set;
            int capacityMask = (keys.length) - 1;
            int firstDelayedRemoved = -1;
            long delayedRemoved = 0L;
            T[] vals = values;
            for (int i = (keys.length) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    if (!(c.contains(vals[i]))) {
                        closeDeletion : if (firstDelayedRemoved < 0) {
                            int indexToRemove = i;
                            int indexToShift = indexToRemove;
                            int shiftDistance = 1;
                            while (true) {
                                indexToShift = (indexToShift - 1) & capacityMask;
                                long keyToShift;
                                if ((keyToShift = keys[indexToShift]) == free) {
                                    break;
                                }
                                if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                                    if (indexToShift > indexToRemove) {
                                        firstDelayedRemoved = i;
                                        delayedRemoved = key;
                                        keys[indexToRemove] = key;
                                        break closeDeletion;
                                    }
                                    if (indexToRemove == i) {
                                        i++;
                                    }
                                    keys[indexToRemove] = keyToShift;
                                    vals[indexToRemove] = vals[indexToShift];
                                    indexToRemove = indexToShift;
                                    shiftDistance = 1;
                                } else {
                                    shiftDistance++;
                                    if (indexToShift == (1 + i)) {
                                        throw new ConcurrentModificationException();
                                    }
                                }
                            }
                            keys[indexToRemove] = free;
                            vals[indexToRemove] = null;
                            postRemoveHook();
                        } else {
                            keys[i] = delayedRemoved;
                        }
                        changed = true;
                    }
                }
            }
            if (firstDelayedRemoved >= 0) {
                closeDelayedRemoved(firstDelayedRemoved, delayedRemoved);
            }
            return changed;
        }
    }
    
    class NoRemovedEntryIterator implements ObjIterator<Map.Entry<Long, T>> {
        long[] keys;
        
        T[] vals;
        
        final long free;
        
        final int capacityMask;
        
        class MutableEntry2 extends KolobokeLongEntityMap<T>.MutableEntry {
            MutableEntry2(int index, long key, T value) {
                super(index, key, value);
            }
            
            @Override
            void updateValueInTable(T newValue) {
                if ((vals) == (values)) {
                    vals[index] = newValue;
                } else {
                    justPut(key, newValue);
                }
            }
        }
        
        int index = -1;
        
        int nextIndex;
        
        KolobokeLongEntityMap<T>.MutableEntry next;
        
        NoRemovedEntryIterator() {
            long[] keys = KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys = set;
            capacityMask = (keys.length) - 1;
            T[] vals = KolobokeLongEntityMap.NoRemovedEntryIterator.this.vals = values;
            long free = this.free = freeValue;
            int nextI = keys.length;
            while ((--nextI) >= 0) {
                long key;
                if ((key = keys[nextI]) != free) {
                    next = new MutableEntry2(nextI, key, vals[nextI]);
                    break;
                }
            }
            nextIndex = nextI;
        }
        
        @Override
        public void forEachRemaining(@Nonnull
                                             Consumer<? super Map.Entry<Long, T>> action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys;
            T[] vals = KolobokeLongEntityMap.NoRemovedEntryIterator.this.vals;
            long free = KolobokeLongEntityMap.NoRemovedEntryIterator.this.free;
            int nextI = nextIndex;
            for (int i = nextI; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    action.accept(new MutableEntry2(i, key, vals[i]));
                }
            }
            if (nextI != (nextIndex)) {
                throw new ConcurrentModificationException();
            }
            index = nextIndex = -1;
        }
        
        @Override
        public boolean hasNext() {
            return (nextIndex) >= 0;
        }
        
        @Override
        public Map.Entry<Long, T> next() {
            int nextI;
            if ((nextI = nextIndex) >= 0) {
                index = nextI;
                long[] keys = KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys;
                long free = KolobokeLongEntityMap.NoRemovedEntryIterator.this.free;
                KolobokeLongEntityMap<T>.MutableEntry prev = next;
                while ((--nextI) >= 0) {
                    long key;
                    if ((key = keys[nextI]) != free) {
                        next = new MutableEntry2(nextI, key, vals[nextI]);
                        break;
                    }
                }
                nextIndex = nextI;
                return prev;
            } else {
                throw new NoSuchElementException();
            }
        }
        
        @Override
        public void remove() {
            int index;
            if ((index = KolobokeLongEntityMap.NoRemovedEntryIterator.this.index) >= 0) {
                KolobokeLongEntityMap.NoRemovedEntryIterator.this.index = -1;
                long[] keys = KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys;
                T[] vals = KolobokeLongEntityMap.NoRemovedEntryIterator.this.vals;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedEntryIterator.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == (free)) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = (nextIndex) + 1) > 0) {
                                        KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        KolobokeLongEntityMap.NoRemovedEntryIterator.this.vals = Arrays.copyOf(vals, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedEntryIterator.this.keys[indexToRemove] = free;
                                            KolobokeLongEntityMap.NoRemovedEntryIterator.this.vals[indexToRemove] = null;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedEntryIterator.this.nextIndex = index;
                                    if (indexToShift < (index - 1)) {
                                        KolobokeLongEntityMap.NoRemovedEntryIterator.this.next = new MutableEntry2(indexToShift, keyToShift, vals[indexToShift]);
                                    }
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            vals[indexToRemove] = vals[indexToShift];
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    vals[indexToRemove] = null;
                    postRemoveHook();
                } else {
                    justRemove(keys[index]);
                    vals[index] = null;
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    class NoRemovedEntryCursor implements ObjCursor<Map.Entry<Long, T>> {
        long[] keys;
        
        T[] vals;
        
        final long free;
        
        final int capacityMask;
        
        class MutableEntry2 extends KolobokeLongEntityMap<T>.MutableEntry {
            MutableEntry2(int index, long key, T value) {
                super(index, key, value);
            }
            
            @Override
            void updateValueInTable(T newValue) {
                if ((vals) == (values)) {
                    vals[index] = newValue;
                } else {
                    justPut(key, newValue);
                }
            }
        }
        
        int index;
        
        long curKey;
        
        T curValue;
        
        NoRemovedEntryCursor() {
            long[] keys = KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys = set;
            capacityMask = (keys.length) - 1;
            index = keys.length;
            vals = values;
            long free = this.free = freeValue;
            curKey = free;
        }
        
        @Override
        public void forEachForward(Consumer<? super Map.Entry<Long, T>> action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys;
            T[] vals = KolobokeLongEntityMap.NoRemovedEntryCursor.this.vals;
            long free = KolobokeLongEntityMap.NoRemovedEntryCursor.this.free;
            int index = KolobokeLongEntityMap.NoRemovedEntryCursor.this.index;
            for (int i = index - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    action.accept(new MutableEntry2(i, key, vals[i]));
                }
            }
            if (index != (KolobokeLongEntityMap.NoRemovedEntryCursor.this.index)) {
                throw new ConcurrentModificationException();
            }
            KolobokeLongEntityMap.NoRemovedEntryCursor.this.index = -1;
            curKey = free;
        }
        
        @Override
        public Map.Entry<Long, T> elem() {
            long curKey;
            if ((curKey = KolobokeLongEntityMap.NoRemovedEntryCursor.this.curKey) != (free)) {
                return new MutableEntry2(index, curKey, curValue);
            } else {
                throw new IllegalStateException();
            }
        }
        
        @Override
        public boolean moveNext() {
            long[] keys = KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys;
            long free = KolobokeLongEntityMap.NoRemovedEntryCursor.this.free;
            for (int i = (index) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    index = i;
                    curKey = key;
                    curValue = vals[i];
                    return true;
                }
            }
            curKey = free;
            index = -1;
            return false;
        }
        
        @Override
        public void remove() {
            long curKey;
            long free;
            if ((curKey = KolobokeLongEntityMap.NoRemovedEntryCursor.this.curKey) != (free = KolobokeLongEntityMap.NoRemovedEntryCursor.this.free)) {
                KolobokeLongEntityMap.NoRemovedEntryCursor.this.curKey = free;
                int index = KolobokeLongEntityMap.NoRemovedEntryCursor.this.index;
                long[] keys = KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys;
                T[] vals = KolobokeLongEntityMap.NoRemovedEntryCursor.this.vals;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedEntryCursor.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == free) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = index) > 0) {
                                        KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        KolobokeLongEntityMap.NoRemovedEntryCursor.this.vals = Arrays.copyOf(vals, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedEntryCursor.this.keys[indexToRemove] = free;
                                            KolobokeLongEntityMap.NoRemovedEntryCursor.this.vals[indexToRemove] = null;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedEntryCursor.this.index = ++index;
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            vals[indexToRemove] = vals[indexToShift];
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    vals[indexToRemove] = null;
                    postRemoveHook();
                } else {
                    justRemove(curKey);
                    vals[index] = null;
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    class NoRemovedValueIterator implements ObjIterator<T> {
        long[] keys;
        
        T[] vals;
        
        final long free;
        
        final int capacityMask;
        
        int index = -1;
        
        int nextIndex;
        
        T next;
        
        NoRemovedValueIterator() {
            long[] keys = KolobokeLongEntityMap.NoRemovedValueIterator.this.keys = set;
            capacityMask = (keys.length) - 1;
            T[] vals = KolobokeLongEntityMap.NoRemovedValueIterator.this.vals = values;
            long free = this.free = freeValue;
            int nextI = keys.length;
            while ((--nextI) >= 0) {
                if ((keys[nextI]) != free) {
                    next = vals[nextI];
                    break;
                }
            }
            nextIndex = nextI;
        }
        
        @Override
        public void forEachRemaining(Consumer<? super T> action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedValueIterator.this.keys;
            T[] vals = KolobokeLongEntityMap.NoRemovedValueIterator.this.vals;
            long free = KolobokeLongEntityMap.NoRemovedValueIterator.this.free;
            int nextI = nextIndex;
            for (int i = nextI; i >= 0; i--) {
                if ((keys[i]) != free) {
                    action.accept(vals[i]);
                }
            }
            if (nextI != (nextIndex)) {
                throw new ConcurrentModificationException();
            }
            index = nextIndex = -1;
        }
        
        @Override
        public boolean hasNext() {
            return (nextIndex) >= 0;
        }
        
        @Override
        public T next() {
            int nextI;
            if ((nextI = nextIndex) >= 0) {
                index = nextI;
                long[] keys = KolobokeLongEntityMap.NoRemovedValueIterator.this.keys;
                long free = KolobokeLongEntityMap.NoRemovedValueIterator.this.free;
                T prev = next;
                while ((--nextI) >= 0) {
                    if ((keys[nextI]) != free) {
                        next = vals[nextI];
                        break;
                    }
                }
                nextIndex = nextI;
                return prev;
            } else {
                throw new NoSuchElementException();
            }
        }
        
        @Override
        public void remove() {
            int index;
            if ((index = KolobokeLongEntityMap.NoRemovedValueIterator.this.index) >= 0) {
                KolobokeLongEntityMap.NoRemovedValueIterator.this.index = -1;
                long[] keys = KolobokeLongEntityMap.NoRemovedValueIterator.this.keys;
                T[] vals = KolobokeLongEntityMap.NoRemovedValueIterator.this.vals;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedValueIterator.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == (free)) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedValueIterator.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = (nextIndex) + 1) > 0) {
                                        KolobokeLongEntityMap.NoRemovedValueIterator.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        KolobokeLongEntityMap.NoRemovedValueIterator.this.vals = Arrays.copyOf(vals, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedValueIterator.this.keys[indexToRemove] = free;
                                            KolobokeLongEntityMap.NoRemovedValueIterator.this.vals[indexToRemove] = null;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedValueIterator.this.nextIndex = index;
                                    if (indexToShift < (index - 1)) {
                                        KolobokeLongEntityMap.NoRemovedValueIterator.this.next = vals[indexToShift];
                                    }
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            vals[indexToRemove] = vals[indexToShift];
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    vals[indexToRemove] = null;
                    postRemoveHook();
                } else {
                    justRemove(keys[index]);
                    vals[index] = null;
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    class NoRemovedValueCursor implements ObjCursor<T> {
        long[] keys;
        
        T[] vals;
        
        final long free;
        
        final int capacityMask;
        
        int index;
        
        long curKey;
        
        T curValue;
        
        NoRemovedValueCursor() {
            long[] keys = KolobokeLongEntityMap.NoRemovedValueCursor.this.keys = set;
            capacityMask = (keys.length) - 1;
            index = keys.length;
            vals = values;
            long free = this.free = freeValue;
            curKey = free;
        }
        
        @Override
        public void forEachForward(Consumer<? super T> action) {
            if (action == null)
                throw new NullPointerException();
            
            long[] keys = KolobokeLongEntityMap.NoRemovedValueCursor.this.keys;
            T[] vals = KolobokeLongEntityMap.NoRemovedValueCursor.this.vals;
            long free = KolobokeLongEntityMap.NoRemovedValueCursor.this.free;
            int index = KolobokeLongEntityMap.NoRemovedValueCursor.this.index;
            for (int i = index - 1; i >= 0; i--) {
                if ((keys[i]) != free) {
                    action.accept(vals[i]);
                }
            }
            if (index != (KolobokeLongEntityMap.NoRemovedValueCursor.this.index)) {
                throw new ConcurrentModificationException();
            }
            KolobokeLongEntityMap.NoRemovedValueCursor.this.index = -1;
            curKey = free;
        }
        
        @Override
        public T elem() {
            if ((curKey) != (free)) {
                return curValue;
            } else {
                throw new IllegalStateException();
            }
        }
        
        @Override
        public boolean moveNext() {
            long[] keys = KolobokeLongEntityMap.NoRemovedValueCursor.this.keys;
            long free = KolobokeLongEntityMap.NoRemovedValueCursor.this.free;
            for (int i = (index) - 1; i >= 0; i--) {
                long key;
                if ((key = keys[i]) != free) {
                    index = i;
                    curKey = key;
                    curValue = vals[i];
                    return true;
                }
            }
            curKey = free;
            index = -1;
            return false;
        }
        
        @Override
        public void remove() {
            long curKey;
            long free;
            if ((curKey = KolobokeLongEntityMap.NoRemovedValueCursor.this.curKey) != (free = KolobokeLongEntityMap.NoRemovedValueCursor.this.free)) {
                KolobokeLongEntityMap.NoRemovedValueCursor.this.curKey = free;
                int index = KolobokeLongEntityMap.NoRemovedValueCursor.this.index;
                long[] keys = KolobokeLongEntityMap.NoRemovedValueCursor.this.keys;
                T[] vals = KolobokeLongEntityMap.NoRemovedValueCursor.this.vals;
                if (keys == (set)) {
                    int capacityMask = KolobokeLongEntityMap.NoRemovedValueCursor.this.capacityMask;
                    int indexToRemove = index;
                    int indexToShift = indexToRemove;
                    int shiftDistance = 1;
                    while (true) {
                        indexToShift = (indexToShift - 1) & capacityMask;
                        long keyToShift;
                        if ((keyToShift = keys[indexToShift]) == free) {
                            break;
                        }
                        if ((((LHash.SeparateKVLongKeyMixing.mix(keyToShift)) - indexToShift) & capacityMask) >= shiftDistance) {
                            if ((KolobokeLongEntityMap.NoRemovedValueCursor.this.keys) == keys) {
                                if (indexToShift > indexToRemove) {
                                    int slotsToCopy;
                                    if ((slotsToCopy = index) > 0) {
                                        KolobokeLongEntityMap.NoRemovedValueCursor.this.keys = Arrays.copyOf(keys, slotsToCopy);
                                        KolobokeLongEntityMap.NoRemovedValueCursor.this.vals = Arrays.copyOf(vals, slotsToCopy);
                                        if (indexToRemove < slotsToCopy) {
                                            KolobokeLongEntityMap.NoRemovedValueCursor.this.keys[indexToRemove] = free;
                                            KolobokeLongEntityMap.NoRemovedValueCursor.this.vals[indexToRemove] = null;
                                        }
                                    }
                                } else if (indexToRemove == index) {
                                    KolobokeLongEntityMap.NoRemovedValueCursor.this.index = ++index;
                                }
                            }
                            keys[indexToRemove] = keyToShift;
                            vals[indexToRemove] = vals[indexToShift];
                            indexToRemove = indexToShift;
                            shiftDistance = 1;
                        } else {
                            shiftDistance++;
                            if (indexToShift == (1 + index)) {
                                throw new ConcurrentModificationException();
                            }
                        }
                    }
                    keys[indexToRemove] = free;
                    vals[indexToRemove] = null;
                    postRemoveHook();
                } else {
                    justRemove(curKey);
                    vals[index] = null;
                }
            } else {
                throw new IllegalStateException();
            }
        }
    }
    
    KolobokeLongEntityMap(HashConfig hashConfig, int expectedSize) {
        this.init(new HashConfigWrapper(hashConfig), expectedSize);
    }
    
    static class Support {
        static interface LongHash extends Hash {
            long freeValue();
            
            boolean supportRemoved();
            
            long removedValue();
        }
        
        static interface SeparateKVLongLHash extends LHash , KolobokeLongEntityMap.Support.SeparateKVLongHash {        }
        
        static interface SeparateKVLongHash extends KolobokeLongEntityMap.Support.LongHash {
            @Nonnull
            long[] keys();
        }
    }
    
    static final HashConfigWrapper DEFAULT_CONFIG_WRAPPER = new HashConfigWrapper(HashConfig.getDefault());
}

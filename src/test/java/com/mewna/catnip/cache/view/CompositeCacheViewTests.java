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

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.*;
import java.util.stream.Collectors;

public class CompositeCacheViewTests {
    @SafeVarargs
    private static <T> CompositeCacheView<T> composite(final CacheView<T>... views) {
        return new CompositeCacheView<>(Arrays.asList(views));
    }
    
    @Test
    public void getById() {
        final DefaultCacheView<String> cache = new DefaultCacheView<>();
        cache.put(123, "some string");
        Assertions.assertEquals(composite(cache).getById(123), "some string");
    }
    
    @Test
    public void size() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertEquals(composite(cache1, cache2).size(), 2);
    }
    
    @Test
    public void isEmpty() {
        Assertions.assertTrue(composite().isEmpty());
    }
    
    @Test
    public void isNotEmpty() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertFalse(composite(cache1, cache2).isEmpty());
    }
    
    @Test
    public void findAny() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertEquals(composite(cache1, cache2).findAny(__ -> true), "some string");
    }
    
    @Test
    public void findAnyNoMatches() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertNull(composite(cache1, cache2).findAny(__ -> false));
    }
    
    @Test
    public void find() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertEquals(composite(cache1, cache2).find(__ -> true).size(), 2);
    }
    
    @Test
    public void findNoMatches() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertTrue(composite(cache1, cache2).find(__ -> false).isEmpty());
    }
    
    @Test
    public void collect1() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final List<String> list = composite(cache1, cache2).collect(Collectors.toList());
        Assertions.assertEquals(list.size(), 2);
        Assertions.assertTrue(list.contains("some string"));
        Assertions.assertTrue(list.contains("some other string"));
    }
    
    @Test
    public void collect2() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final List<String> list = composite(cache1, cache2).collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        Assertions.assertEquals(list.size(), 2);
        Assertions.assertTrue(list.contains("some string"));
        Assertions.assertTrue(list.contains("some other string"));
    }
    
    @Test
    public void reduce1() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final String s = composite(cache1, cache2).reduce("", String::concat, String::concat);
        Assertions.assertEquals(s.length(), "some string".length() + "some other string".length());
        Assertions.assertTrue(
                s.equals("some stringsome other string") ||
                        s.equals("some other stringsome string")
        );
    }
    
    @Test
    public void reduce2() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final String s = composite(cache1, cache2).reduce("", String::concat);
        Assertions.assertEquals(s.length(), "some string".length() + "some other string".length());
        Assertions.assertTrue(
                s.equals("some stringsome other string") ||
                        s.equals("some other stringsome string")
        );
    }
    
    @Test
    public void reduce3Empty() {
        final Optional<String> maybeS = CompositeCacheViewTests.<String>composite().reduce(String::concat);
        Assertions.assertFalse(maybeS.isPresent());
    }
    
    @Test
    public void reduce3() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final Optional<String> maybeS = composite(cache1, cache2).reduce(String::concat);
        Assertions.assertTrue(maybeS.isPresent());
        final String s = maybeS.get();
        Assertions.assertEquals(s.length(), "some string".length() + "some other string".length());
        Assertions.assertTrue(
                s.equals("some stringsome other string") ||
                        s.equals("some other stringsome string")
        );
    }
    
    @Test
    public void anyMatch() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertTrue(composite(cache1, cache2).anyMatch("some string"::equals));
    }
    
    @Test
    public void anyMatchEmpty() {
        Assertions.assertFalse(composite().anyMatch("some string"::equals));
    }
    
    @Test
    public void allMatch() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertFalse(composite(cache1, cache2).allMatch("some string"::equals));
    }
    
    @Test
    public void allMatchEmpty() {
        Assertions.assertTrue(composite().allMatch("some string"::equals));
    }
    
    @Test
    public void noneMatch() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        Assertions.assertFalse(composite(cache1, cache2).noneMatch("some string"::equals));
    }
    
    @Test
    public void noneMatchEmpty() {
        Assertions.assertTrue(composite().noneMatch("some string"::equals));
    }
    
    @Test
    public void min() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final Optional<String> min = composite(cache1, cache2).min(Comparator.comparingInt(String::length));
        Assertions.assertTrue(min.isPresent());
        Assertions.assertEquals(min.get(), "some string");
    }
    
    @Test
    public void max() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        cache1.put(123, "some string");
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        cache2.put(456, "some other string");
        final Optional<String> max = composite(cache1, cache2).max(Comparator.comparingInt(String::length));
        Assertions.assertTrue(max.isPresent());
        Assertions.assertEquals(max.get(), "some other string");
    }
    
    @Test
    public void keys() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        final CompositeCacheView<String> cache = composite(cache1, cache2);
        Assertions.assertTrue(cache.keys().isEmpty());
        cache1.put(123, "some string");
        Assertions.assertEquals(cache.keys().size(), 1);
        cache2.put(456, "some other string");
        Assertions.assertEquals(cache.keys().size(), 2);
        
        Assertions.assertTrue(cache.keys().contains(123L));
        Assertions.assertTrue(cache.keys().contains(456L));
        Assertions.assertFalse(cache.keys().contains(789L));
    }
    
    @Test
    public void values() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        final CompositeCacheView<String> cache = composite(cache1, cache2);
        Assertions.assertTrue(cache.values().isEmpty());
        cache1.put(123, "some string");
        Assertions.assertEquals(cache.values().size(), 1);
        cache2.put(456, "some other string");
        Assertions.assertEquals(cache.values().size(), 2);
        
        Assertions.assertTrue(cache.values().contains("some string"));
        Assertions.assertTrue(cache.values().contains("some other string"));
        Assertions.assertFalse(cache.values().contains("yet another string"));
    }
    
    @Test
    public void count() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        final CompositeCacheView<String> cache = composite(cache1, cache2);
        Assertions.assertEquals(cache.count(__ -> true), 0);
        cache1.put(123, "some string");
        Assertions.assertEquals(cache.count(__ -> true), 1);
        cache2.put(456, "some other string");
        Assertions.assertEquals(cache.count(__ -> true), 2);
        Assertions.assertEquals(cache.count("some string"::equals), 1);
        Assertions.assertEquals(cache.count("some other string"::equals), 1);
        Assertions.assertEquals(cache.count("yet another string"::equals), 0);
    }
    
    @Test
    public void snapshot() {
        final DefaultCacheView<String> cache1 = new DefaultCacheView<>();
        final DefaultCacheView<String> cache2 = new DefaultCacheView<>();
        final CompositeCacheView<String> cache = composite(cache1, cache2);
        final Collection<String> snapshot1 = cache.snapshot();
        Assertions.assertTrue(cache.values().isEmpty());
        cache1.put(123, "some string");
        Assertions.assertTrue(snapshot1.isEmpty());
        Assertions.assertEquals(cache.values().size(), 1);
        final Collection<String> snapshot2 = cache.snapshot();
        cache2.put(456, "some other string");
        Assertions.assertEquals(cache.values().size(), 2);
        Assertions.assertEquals(snapshot2.size(), 1);
        
        Assertions.assertFalse(snapshot1.contains("some string"));
        Assertions.assertTrue(snapshot2.contains("some string"));
        Assertions.assertFalse(snapshot2.contains("yet another string"));
    }
}

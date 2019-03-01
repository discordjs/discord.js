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

import java.util.function.Function;

public class DefaultNamedCacheViewTests {
    @Test
    public void findByName() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByName("string").isEmpty());
        Assertions.assertTrue(cache.findByName("StRiNg").isEmpty());
    }
    
    @Test
    public void findByNameIgnoreCase() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByName("StRiNg", true).isEmpty());
    }
    
    @Test
    public void findByNameContains() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByNameContains("tri").isEmpty());
        Assertions.assertTrue(cache.findByNameContains("tRi").isEmpty());
    }
    
    @Test
    public void findByNameContainsIgnoreCase() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByNameContains("tRi", true).isEmpty());
    }
    
    @Test
    public void findByNameStartsWith() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByNameStartsWith("str").isEmpty());
        Assertions.assertTrue(cache.findByNameStartsWith("StR").isEmpty());
    }
    
    @Test
    public void findByNameStartsWithIgnoreCase() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByNameStartsWith("StR", true).isEmpty());
    }
    
    @Test
    public void findByNameEndsWith() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByNameEndsWith("ing").isEmpty());
        Assertions.assertTrue(cache.findByNameEndsWith("iNg").isEmpty());
    }
    
    @Test
    public void findByNameEndsWithIgnoreCase() {
        final DefaultNamedCacheView<String> cache = new DefaultNamedCacheView<>(Function.identity());
        cache.put(123, "string");
        Assertions.assertFalse(cache.findByNameEndsWith("iNg", true).isEmpty());
    }
}

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

package com.mewna.catnip.extension.manager;

import com.google.common.collect.ImmutableSet;
import com.mewna.catnip.Catnip;
import com.mewna.catnip.extension.Extension;
import io.vertx.core.impl.ConcurrentHashSet;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;

import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * @author amy
 * @since 9/6/18
 */
@Accessors(fluent = true)
@RequiredArgsConstructor
public class DefaultExtensionManager implements ExtensionManager {
    @Getter
    private final Catnip catnip;
    private final Collection<Extension> loadedExtensions = new ConcurrentHashSet<>();
    
    @Override
    public ExtensionManager loadExtension(@Nonnull final Extension extension) {
        if(!loadedExtensions.contains(extension)) {
            extension.catnip(catnip);
            catnip.vertx().deployVerticle(extension);
            loadedExtensions.add(extension);
        }
        return this;
    }
    
    @Override
    public ExtensionManager unloadExtension(@Nonnull final Extension extension) {
        if(loadedExtensions.contains(extension)) {
            catnip.vertx().undeploy(extension.deploymentID());
            loadedExtensions.remove(extension);
        }
        return this;
    }
    
    @Nonnull
    @Override
    public Set<Extension> matchingExtensions(@Nonnull final String regex) {
        //small optimization
        final Pattern pattern = Pattern.compile(regex);
        return Collections.unmodifiableSet(loadedExtensions.stream()
                .filter(e -> pattern.matcher(e.name()).matches())
                .collect(Collectors.toSet()));
    }
    
    @Nonnull
    @Override
    public <T extends Extension> Set<? extends T> matchingExtensions(@Nonnull final Class<T> extensionClass) {
        return Collections.unmodifiableSet(loadedExtensions.stream()
                .filter(extensionClass::isInstance)
                .map(extensionClass::cast)
                .collect(Collectors.toSet()));
    }
    
    @Nonnull
    @Override
    public Set<Extension> extensions() {
        return ImmutableSet.copyOf(loadedExtensions);
    }
}

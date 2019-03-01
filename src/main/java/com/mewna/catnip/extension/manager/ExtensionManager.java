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

import com.mewna.catnip.Catnip;
import com.mewna.catnip.extension.Extension;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Set;

/**
 * An {@link ExtensionManager} implementation is exactly what it sounds like:
 * it manages {@link Extension}s and takes care of lifecycle hooks, injecting
 * {@link Catnip} instances, and so on. Proper implementations of this class
 * will, among other things, pay attention to the caveats mentioned in the
 * {@link Extension} docs, to ensure compatibility with the
 * {@link DefaultExtensionManager}.
 *
 * @author amy
 * @since 9/6/18
 */
@SuppressWarnings({"unused", "UnusedReturnValue"})
public interface ExtensionManager {
    /**
     * Load the given extension instance. Note than an extension may not be
     * loaded more than once, and attempting to load an extension multiple
     * times will no-op.
     *
     * @param extension The extension to load.
     */
    ExtensionManager loadExtension(@Nonnull Extension extension);
    
    /**
     * Unload the given extension instance. If the extension is not already
     * loaded, this method will be a no-op.
     *
     * @param extension The extension to unload.
     */
    ExtensionManager unloadExtension(@Nonnull Extension extension);
    
    /**
     * Get all loaded extensions whose names match the specified regex. This
     * method will only return extensions loaded by the current instance.
     *
     * @param regex The regex to match extension names against.
     *
     * @return A possibly-empty set of extensions that have names matching the
     * supplied regex.
     */
    @Nonnull
    Set<Extension> matchingExtensions(@Nonnull String regex);
    
    /**
     * Get all loaded extensions that are instantiated from the given class.
     * This method will only return extensions loaded by the current instance.
     *
     * @param extensionClass The extension class to find instances of.
     * @param <T>            Type of the extension.
     *
     * @return A possibly-empty set of extensions that are instances of the
     * supplied class.
     */
    @Nonnull
    <T extends Extension> Set<? extends T> matchingExtensions(@Nonnull Class<T> extensionClass);
    
    /**
     * Return a single extension by class. If multiple extensions are loaded
     * from the same class, there is no guarantee which extension instance will
     * be returned, in which case you should be using {@link #matchingExtensions(Class)} )}.
     *
     * @param extensionClass The extension class to find instances of
     * @param <T>            Type of the extension.
     *
     * @return A possibly-{@code null} instance of the passed extension class.
     */
    @Nullable
    default <T extends Extension> T extension(@Nonnull final Class<T> extensionClass) {
        final Set<? extends T> extensions = matchingExtensions(extensionClass);
        if(extensions.isEmpty()) {
            return null;
        } else {
            //noinspection unchecked
            return extensions.iterator().next();
        }
    }
    
    /**
     * Get all loaded extensions. This method will only return extensions
     * loaded by the current instance.
     *
     * @return A possibly-empty set of extensions.
     */
    @Nonnull
    Set<Extension> extensions();
    
    Catnip catnip();
}

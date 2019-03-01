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

package com.mewna.catnip.extension;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.CatnipOptions;
import com.mewna.catnip.extension.hook.CatnipHook;
import com.mewna.catnip.shard.EventType;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Verticle;
import io.vertx.core.eventbus.MessageConsumer;

import javax.annotation.Nonnull;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * <strong>If you are unsure if you need to implement this interface, you
 * probably want {@link AbstractExtension} instead.</strong>
 * <p>
 * An extension is like a "plugin" of sorts - basically, it gives a
 * standardized way to provide extra functionality on top of catnip that is
 * *not* user-level application code. An example of this is providing a command
 * library of some sort. Your library code would be implemented as an extension
 * that an end-user could then optionally load in.
 * <p>
 * Note that this class extends {@link Verticle}. This is because extensions
 * are expected to be deployed as vert.x verticles. A proper catnip
 * implementation will keep track of these deployments to allow unloading or
 * reloading extensions at runtime. Since this class extends {@link Verticle},
 * the easiest way for a custom extension to be "compliant" is to simply extend
 * {@link AbstractExtension}, which itself extends {@link AbstractVerticle}, as
 * well as implementing this interface.
 * <p>
 * Extensions are deployed as vert.x verticles. vert.x provides two lifecycle
 * hooks - {@link Verticle#start(Future)} and {@link Verticle#stop(Future)} -
 * that should be used for managing an extension's lifecycle. This is not, say,
 * a Bukkit server, and as such, there is no need for lifecycle hooks like
 * {@code preload} or {@code unload} or similar to be provided. It is possible
 * that this may change in a future catnip update, but is currently unlikely.
 * Note that {@link AbstractVerticle#start()} and {@link AbstractVerticle#stop()}
 * are provided as convenience methods for when a {@link Future} is not needed,
 * and will automatically be available if implementations are based off of
 * {@link AbstractExtension} or {@link AbstractVerticle}.
 * <p>
 * Note that the lifecycle callbacks are called <strong>SYNCHRONOUSLY</strong>
 * by vert.x, and as such you should take care to not block the event loop in
 * those callbacks!
 *
 * @author amy
 * @since 9/6/18
 */
@SuppressWarnings("unused")
public interface Extension extends Verticle {
    /**
     * The name of this extension. Note that an extension's name is
     * <strong>NOT</strong> guaranteed unique, and so your code should NOT rely
     * on this for uniqueness!
     *
     * @return The name of this extension.
     */
    @Nonnull
    String name();
    
    /**
     * The catnip instance this extension is registered to. This will not be
     * {@code null}, as a proper extension manager implementation should inject
     * the current catnip instance BEFORE deploying the extension.
     *
     * @return The catnip instance this extension is registered to.
     */
    @Nonnull
    Catnip catnip();
    
    /**
     * Inject a catnip instance into this extension. This should be the same as
     * the catnip version that is deploying this extension, and must not be
     * {@code null}. A proper extension manager implementation will call this
     * method to inject a catnip instance BEFORE deploying the extension, ie.
     * {@link Verticle#start(Future)} / {@link AbstractVerticle#start()} will
     * be called AFTER this method.
     *
     * @param catnip The catnip instance to inject. May not be {@code null}.
     */
    @SuppressWarnings("UnusedReturnValue")
    Extension catnip(@Nonnull Catnip catnip);
    
    /**
     * Register a hook into catnip. Hooks are registered by extension, so
     * unloading an extension will also unload all of its hooks.
     *
     * @param hook The hook to register.
     *
     * @return The extension instance.
     */
    Extension registerHook(@Nonnull CatnipHook hook);
    
    /**
     * @return All hooks registered by this extension instance.
     */
    Set<CatnipHook> hooks();
    
    /**
     * Unregister a hook from catnip.
     *
     * @param hook The hook to unregister.
     *
     * @return The extension instance.
     */
    Extension unregisterHook(@Nonnull CatnipHook hook);
    
    /**
     * Inject options into the catnip instance. You cannot override {@code token}
     * or {@code logExtensionOverrides} from this.
     *
     * @param optionsPatcher A function that makes changes to the provided
     *                        default options object.
     *
     * @return The extension instance.
     */
    default Extension injectOptions(@Nonnull final Function<CatnipOptions, CatnipOptions> optionsPatcher) {
        catnip().injectOptions(this, optionsPatcher);
        return this;
    }
    
    /**
     * Add a consumer for the specified event type.
     *
     * This method behaves similarly to {@link Catnip#on(EventType)},
     * but the event listeners are unregistered when the extension unloads
     *
     * @param type The type of event to listen on.
     * @param <T>  The object type of event being listened on.
     *
     * @return The vert.x message consumer.
     */
    <T> MessageConsumer<T> on(@Nonnull EventType<T> type);
    
    /**
     * Add a consumer for the specified event type with the given handler
     * callback.
     *
     * This method behaves similarly to {@link Catnip#on(EventType, Consumer)},
     * but the event listeners are unregistered when the extension unloads
     *
     * @param type    The type of event to listen on.
     * @param handler The handler for the event object.
     * @param <T>     The object type of event being listened on.
     *
     * @return The vert.x message consumer.
     */
    <T> MessageConsumer<T> on(@Nonnull EventType<T> type, @Nonnull Consumer<T> handler);
    
    String deploymentID();
}

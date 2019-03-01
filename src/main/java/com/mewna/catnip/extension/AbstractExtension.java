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

import com.google.common.collect.ImmutableSet;
import com.mewna.catnip.Catnip;
import com.mewna.catnip.extension.hook.CatnipHook;
import com.mewna.catnip.shard.EventType;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.impl.ConcurrentHashSet;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.Set;
import java.util.function.Consumer;

/**
 * @author amy
 * @since 9/6/18
 */
@Accessors(fluent = true, chain = true)
@SuppressWarnings("WeakerAccess")
@RequiredArgsConstructor
public abstract class AbstractExtension extends AbstractVerticle implements Extension {
    @Getter
    private final String name;
    private final Collection<CatnipHook> hooks = new ConcurrentHashSet<>();
    @Getter
    @Setter
    private Catnip catnip;
    
    @Override
    public Extension registerHook(@Nonnull final CatnipHook hook) {
        hooks.add(hook);
        return this;
    }
    
    @Override
    public Extension unregisterHook(@Nonnull final CatnipHook hook) {
        hooks.remove(hook);
        return this;
    }
    
    @Override
    public Set<CatnipHook> hooks() {
        return ImmutableSet.copyOf(hooks);
    }
    
    @Override
    public <T> MessageConsumer<T> on(@Nonnull final EventType<T> type) {
        final MessageConsumer<T> consumer = catnip().dispatchManager().createConsumer(type.key());
        context.addCloseHook(consumer::unregister);
        return consumer;
    }
    
    @Override
    public <T> MessageConsumer<T> on(@Nonnull final EventType<T> type, @Nonnull final Consumer<T> handler) {
        return on(type).handler(m -> handler.accept(m.body()));
    }
}

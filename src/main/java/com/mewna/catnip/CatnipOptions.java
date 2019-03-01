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

package com.mewna.catnip;

import com.google.common.collect.ImmutableSet;
import com.mewna.catnip.cache.CacheFlag;
import com.mewna.catnip.cache.EntityCacheWorker;
import com.mewna.catnip.cache.SplitMemoryEntityCache;
import com.mewna.catnip.entity.guild.Guild;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.extension.Extension;
import com.mewna.catnip.rest.ratelimit.DefaultRateLimiter;
import com.mewna.catnip.rest.requester.Requester;
import com.mewna.catnip.rest.requester.SerialRequester;
import com.mewna.catnip.shard.DiscordEvent.Raw;
import com.mewna.catnip.shard.buffer.CachingBuffer;
import com.mewna.catnip.shard.buffer.EventBuffer;
import com.mewna.catnip.shard.buffer.NoopBuffer;
import com.mewna.catnip.shard.event.DefaultDispatchManager;
import com.mewna.catnip.shard.event.DispatchManager;
import com.mewna.catnip.shard.manager.DefaultShardManager;
import com.mewna.catnip.shard.manager.ShardManager;
import com.mewna.catnip.shard.ratelimit.MemoryRatelimiter;
import com.mewna.catnip.shard.ratelimit.Ratelimiter;
import com.mewna.catnip.shard.session.DefaultSessionManager;
import com.mewna.catnip.shard.session.SessionManager;
import com.mewna.catnip.util.logging.DefaultLogAdapter;
import com.mewna.catnip.util.logging.LogAdapter;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import okhttp3.OkHttpClient.Builder;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.EnumSet;
import java.util.Set;

/**
 * @author amy
 * @since 9/25/18.
 */
@Getter
@Setter
@Accessors(fluent = true, chain = true)
@RequiredArgsConstructor
@SuppressWarnings("OverlyCoupledClass")
public final class CatnipOptions implements Cloneable {
    /**
     * The token for catnip to use.
     * <p>
     * May not be overridden by extensions.
     */
    @Nonnull
    private final String token;
    /**
     * The shard manager for catnip to use. Defaults to {@link DefaultShardManager}.
     */
    @Nonnull
    private ShardManager shardManager = new DefaultShardManager();
    /**
     * The session manager for catnip to use. Defaults to {@link DefaultSessionManager}
     */
    @Nonnull
    private SessionManager sessionManager = new DefaultSessionManager();
    /**
     * The gateway ratelimiter for catnip to use. Defaults to {@link MemoryRatelimiter}
     */
    @Nonnull
    private Ratelimiter gatewayRatelimiter = new MemoryRatelimiter();
    /**
     * The log adapter for catnip to use. Defaults to {@link DefaultLogAdapter},
     * which uses SLF4J.
     */
    @Nonnull
    private LogAdapter logAdapter = new DefaultLogAdapter();
    /**
     * The event buffer for catnip to use. Defaults to {@link CachingBuffer}.
     * If you want to use an alternative event buffering strategy (ex. no
     * buffering, only buffer certain events, ...) you can write your own
     * implementation. For no buffering, {@link NoopBuffer} is provided.
     * <p>Do NOT change this if you don't know what you're doing!</p>
     */
    @Nonnull
    private EventBuffer eventBuffer = new CachingBuffer();
    /**
     * The cache worker for catnip to use. Defaults to {@link SplitMemoryEntityCache}.
     * Change this if you want to use your own {@link EntityCacheWorker}.
     */
    @Nonnull
    private EntityCacheWorker cacheWorker = new SplitMemoryEntityCache();
    /**
     * The set of cache flags for catnip to obey. Used to prevent caching certain
     * things.
     */
    @Nonnull
    private Set<CacheFlag> cacheFlags = EnumSet.noneOf(CacheFlag.class);
    /**
     * Manages event dispatching and consumers. Defaults to {@link DefaultDispatchManager}.
     */
    @Nonnull
    private DispatchManager dispatchManager = new DefaultDispatchManager();
    /**
     * Whether or not catnip should chunk members. Do not disable this if you
     * don't know what it does.
     */
    private boolean chunkMembers = true;
    /**
     * Whether or not catnip should emit full event objects. Do not disable
     * this if you don't know what it does. Mainly only useful for ex. an
     * {@link Extension} that does things with the raw gateway payloads, like
     * sending them to a message queue.
     */
    private boolean emitEventObjects = true;
    /**
     * Whether or not catnip should enforce permissions for REST actions. Note
     * that this will NOT enforce permissions if you directly call methods via
     * {@link Catnip#rest()}, but will enforce them if you call them from
     * entity objects (ex. doing {@link Guild#delete()}).
     */
    private boolean enforcePermissions = true;
    /**
     * The presence that catnip should set for shards as they log in. This is
     * for setting whether your bot appears online/DND/away/offline, as well as
     * the "playing XXX" status.
     */
    @Nullable
    private Presence presence;
    /**
     * The events that catnip should not emit. You can use {@link Raw} to get
     * the event names.
     */
    @Nonnull
    private Set<String> disabledEvents = ImmutableSet.of();
    @Nonnull
    private Requester requester = new SerialRequester(new DefaultRateLimiter(), new Builder());
    /**
     * Whether or not extensions overriding options should be logged. Defaults
     * to {@code true}.
     * <p>
     * May not be overridden by extensions.
     */
    private boolean logExtensionOverrides = true;
    /**
     * Whether or not to validate the provided token when setting up catnip. It
     * is HIGHLY recommended that you leave this with the default setting.
     * <p>
     * May not be overridden by extensions.
     */
    private boolean validateToken = true;
    /**
     * Whether or not catnip should capture REST stacktraces before running
     * REST requests.
     * <p>
     * catnip runs REST requests asynchronously. Because of this, we lose the
     * caller's stacktrace, and exceptions thrown from REST calls are lost to
     * the ether basically. If this option is enabled, catnip will capture a
     * stacktrace before REST requests, and make it available to any exceptions
     * thrown by the REST handler.
     * <p>
     * NOTE: Capturing stacktraces is <strong>s l o w</strong>. If you have
     * performance problems around REST requests, you can disable this, at the
     * cost of losing debugability.
     * <p>
     * TODO: When we move off of Java 8, use the stack walking API for this
     */
    private boolean captureRestStacktraces = true;
    
    @Override
    public Object clone() {
        try {
            return super.clone();
        } catch(final CloneNotSupportedException e) {
            throw new IllegalStateException("Couldn't clone!", e);
        }
    }
}

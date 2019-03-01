/*
 * Copyright (c) 2019 amy, All rights reserved.
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

package com.mewna.catnip.rest.ratelimit;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.rest.Routes.Route;

import javax.annotation.Nonnull;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

public class DefaultRateLimiter implements RateLimiter {
    private static final CompletionStage<Void> EXECUTE_NOW = CompletableFuture.completedFuture(null);
    private final Map<String, BucketContainer> buckets = new ConcurrentHashMap<>();
    private volatile long globalRateLimitReset;
    private Catnip catnip;
    
    @Override
    public void catnip(@Nonnull final Catnip catnip) {
        this.catnip = catnip;
    }
    
    @Nonnull
    @Override
    public CompletionStage<Void> requestExecution(@Nonnull final Route route) {
        catnip.logAdapter().trace("Requested execution for route {} (ratelimit key = {})", route, route.ratelimitKey());
        final BucketContainer container = buckets.computeIfAbsent(route.ratelimitKey(), __ -> new BucketContainer());
        //noinspection SynchronizationOnLocalVariableOrMethodParameter
        synchronized(container) {
            catnip.logAdapter().trace("{} remaining requests", container.remaining);
            if(container.remaining > 0) {
                container.remaining--;
                return EXECUTE_NOW;
            }
            final CompletableFuture<Void> future = new CompletableFuture<>();
            container.queue.offer(future);
            queueExecution(container);
            return future;
        }
    }
    
    @Override
    public void updateLimit(@Nonnull final Route route, final int limit) {
        final BucketContainer container = buckets.computeIfAbsent(route.ratelimitKey(), __ -> new BucketContainer());
        //noinspection SynchronizationOnLocalVariableOrMethodParameter
        synchronized(container) {
            container.limit = limit;
        }
    }
    
    @Override
    public void updateRemaining(@Nonnull final Route route, final int remaining) {
        final BucketContainer container = buckets.computeIfAbsent(route.ratelimitKey(), __ -> new BucketContainer());
        //noinspection SynchronizationOnLocalVariableOrMethodParameter
        synchronized(container) {
            container.remaining = remaining;
        }
    }
    
    @Override
    public void updateReset(@Nonnull final Route route, final long resetTimestamp) {
        final BucketContainer container = buckets.computeIfAbsent(route.ratelimitKey(), __ -> new BucketContainer());
        //noinspection SynchronizationOnLocalVariableOrMethodParameter
        synchronized(container) {
            container.reset = resetTimestamp;
        }
    }
    
    @Override
    public void updateDone(@Nonnull final Route route) {
        final BucketContainer container = buckets.computeIfAbsent(route.ratelimitKey(), __ -> new BucketContainer());
        //noinspection SynchronizationOnLocalVariableOrMethodParameter
        synchronized(container) {
            if(!container.queue.isEmpty()) {
                queueExecution(container);
            }
        }
    }
    
    @Override
    public synchronized void updateGlobalRateLimit(final long resetTimestamp) {
        globalRateLimitReset = resetTimestamp;
    }
    
    private synchronized long retryAfter(final long bucketReset) {
        catnip.logAdapter().trace("Calculating retry timestamp (bucket = {}, global = {})", bucketReset, globalRateLimitReset);
        final long retry = Math.max(1, Math.max(bucketReset, globalRateLimitReset) - System.currentTimeMillis());
        catnip.logAdapter().trace("Retrying in {} ms", retry);
        return retry;
    }
    
    private void queueExecution(@Nonnull final BucketContainer container) {
        if(container.timerId != null) {
            return;
        }
        container.timerId = catnip.vertx().setTimer(retryAfter(container.reset), __ -> {
            synchronized(container) {
                container.timerId = null;
                final long now = System.currentTimeMillis();
                if(Math.max(container.reset, globalRateLimitReset) < now) {
                    container.remaining = container.limit;
                    while(!container.queue.isEmpty() && container.remaining > 0) {
                        container.remaining--;
                        container.queue.poll().complete(null);
                    }
                    //if the queue is not empty, execution will be re queued once a request
                    //completes and calls updateBucket
                    return;
                }
                //not enough time, queue again
                queueExecution(container);
            }
        });
    }
    
    private static class BucketContainer {
        // By default, we pretend we have 1 request left in a 1-limit bucket.
        // This is done so that it'll immediately update from the headers on
        // the next request
        private final Queue<CompletableFuture<Void>> queue = new ConcurrentLinkedQueue<>();
        private long limit = 1;
        private long remaining = 1;
        private long reset = System.currentTimeMillis() - 1;
        private Long timerId; //null if not queued
    }
}

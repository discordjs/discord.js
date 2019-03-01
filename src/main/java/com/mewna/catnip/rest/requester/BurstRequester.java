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

package com.mewna.catnip.rest.requester;

import com.mewna.catnip.rest.Routes.Route;
import com.mewna.catnip.rest.ratelimit.RateLimiter;
import okhttp3.OkHttpClient.Builder;

import javax.annotation.Nonnull;

public class BurstRequester extends AbstractRequester {
    private final Bucket bucket = new BurstBucket(this);
    
    public BurstRequester(@Nonnull final RateLimiter rateLimiter, @Nonnull final Builder clientBuilder) {
        super(rateLimiter, clientBuilder);
    }
    
    @Nonnull
    @Override
    protected Bucket getBucket(@Nonnull final Route route) {
        return bucket;
    }
    
    private static class BurstBucket implements Bucket {
        private final AbstractRequester requester;
    
        BurstBucket(final AbstractRequester requester) {
            this.requester = requester;
        }
    
        @Override
        public void queueRequest(@Nonnull final QueuedRequest request) {
            requester.rateLimiter.requestExecution(request.route())
                    .thenRun(() -> requester.executeRequest(request))
                    .exceptionally(e -> {
                        request.future.completeExceptionally(e);
                        return null;
                    });
        }
    
        @Override
        public void failedRequest(@Nonnull final QueuedRequest request, @Nonnull final Throwable failureCause) {
            request.failed();
            if(request.shouldRetry()) {
                queueRequest(request);
            } else {
                requester.catnip.logAdapter().debug("Request {} failed, giving up!", request.request());
                request.future().completeExceptionally(failureCause);
                requestDone();
            }
        }
    
        @Override
        public void requestDone() {
            //noop
        }
    }
}

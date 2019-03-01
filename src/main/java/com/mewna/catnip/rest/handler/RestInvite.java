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

package com.mewna.catnip.rest.handler;

import com.google.common.collect.ImmutableMap;
import com.mewna.catnip.entity.guild.Invite;
import com.mewna.catnip.internal.CatnipImpl;
import com.mewna.catnip.rest.ResponsePayload;
import com.mewna.catnip.rest.Routes;
import com.mewna.catnip.rest.requester.Requester.OutboundRequest;
import io.vertx.core.json.JsonObject;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.concurrent.CompletionStage;

/**
 * @author natanbc
 * @since 9/14/18
 */
@SuppressWarnings({"WeakerAccess", "unused"})
public class RestInvite extends RestHandler {
    public RestInvite(final CatnipImpl catnip) {
        super(catnip);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Invite> getInvite(@Nonnull final String code) {
        return getInviteRaw(code).thenApply(entityBuilder()::createInvite);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> getInviteRaw(@Nonnull final String code) {
        return catnip().requester().queue(new OutboundRequest(Routes.GET_INVITE,
                ImmutableMap.of("invite.code", code)))
                .thenApply(ResponsePayload::object);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Invite> deleteInvite(@Nonnull final String code, @Nullable final String reason) {
        return deleteInviteRaw(code, reason).thenApply(entityBuilder()::createInvite);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<Invite> deleteInvite(@Nonnull final String code) {
        return deleteInvite(code, null);
    }
    
    @Nonnull
    @CheckReturnValue
    public CompletionStage<JsonObject> deleteInviteRaw(@Nonnull final String code, @Nullable final String reason) {
        return catnip().requester().queue(new OutboundRequest(Routes.DELETE_INVITE,
                ImmutableMap.of("invite.code", code)).reason(reason))
                .thenApply(ResponsePayload::object);
    }
}

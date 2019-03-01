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

package com.mewna.catnip.util.pagination;

import com.mewna.catnip.entity.channel.Webhook;
import com.mewna.catnip.entity.guild.audit.ActionType;
import com.mewna.catnip.entity.guild.audit.AuditLogEntry;
import com.mewna.catnip.entity.impl.EntityBuilder;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.util.JsonUtil;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Map;
import java.util.concurrent.CompletionStage;

/**
 * @author natanbc
 * @since 10/9/18.
 */
public abstract class AuditLogPaginator extends BasePaginator<AuditLogEntry, JsonObject, AuditLogPaginator> {
    private final EntityBuilder builder;
    private String userId;
    private ActionType type;
    
    public AuditLogPaginator(@Nonnull final EntityBuilder builder) {
        super(AuditLogEntry::id, 100);
        this.builder = builder;
    }
    
    /**
     * Filters from which user to fetch.
     *
     * @param userId Author of the wanted entries.
     *
     * @return {@code this}, for chaining calls.
     */
    public AuditLogPaginator user(@Nullable final String userId) {
        this.userId = userId;
        return this;
    }
    
    /**
     * Filters what type of entries to fetch.
     *
     * @param type Type of the wanted entries.
     *
     * @return {@code this}, for chaining calls.
     */
    public AuditLogPaginator type(@Nullable final ActionType type) {
        this.type = type;
        return this;
    }
    
    @Nonnull
    @Override
    protected CompletionStage<Void> fetch(@Nonnull final PaginationCallback<AuditLogEntry> action) {
        return fetch(null, new RequestState<>(limit, requestSize, action)
                .extra("user", userId)
                .extra("type", type)
        );
    }
    
    @Override
    protected void update(@Nonnull final RequestState<AuditLogEntry> state, @Nonnull final JsonObject data) {
        //inlined EntityBuilder.immutableListOf and EntityBuilder.createAuditLog
        //this is done so we can do less allocations and only parse the entries
        //we need to.
        final Map<String, Webhook> webhooks = JsonUtil.toMap(data.getJsonArray("webhooks"), x -> x.getString("id"), builder::createWebhook);
        final Map<String, User> users = JsonUtil.toMap(data.getJsonArray("users"), x -> x.getString("id"), builder::createUser);
        final JsonArray entries = data.getJsonArray("audit_log_entries");
        
        for(final Object object : entries) {
            if(!(object instanceof JsonObject)) {
                throw new IllegalArgumentException("Expected all values to be JsonObjects, but found " +
                        (object == null ? "null" : object.getClass()));
            }
            final AuditLogEntry entry = builder.createAuditLogEntry((JsonObject) object, webhooks, users);
            state.update(entry);
            if(state.done()) {
                return;
            }
        }
    }
}

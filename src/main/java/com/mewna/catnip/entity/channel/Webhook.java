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

package com.mewna.catnip.entity.channel;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.guild.GuildEntity;
import com.mewna.catnip.entity.impl.WebhookImpl;
import com.mewna.catnip.entity.message.Embed;
import com.mewna.catnip.entity.message.Message;
import com.mewna.catnip.entity.message.MessageOptions;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.rest.requester.Requester;
import com.mewna.catnip.util.PermissionUtil;
import io.vertx.core.json.JsonObject;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Objects;
import java.util.concurrent.CompletionStage;

/**
 * A webhook on a channel. Allows sending messages to a text channel in a guild
 * without having to have a bot application.
 *
 * @author natanbc
 * @since 9/15/18
 */
@SuppressWarnings("unused")
@JsonDeserialize(as = WebhookImpl.class)
public interface Webhook extends GuildEntity, Snowflake {
    /**
     * Send a message to this channel with the specified content.
     *
     * @param content The text content to send.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> executeWebhook(@Nonnull final String content) {
        return executeWebhook(content, null, null);
    }
    
    /**
     * Send a message to this channel with the specified embed.
     *
     * @param embed The embed to send.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> executeWebhook(@Nonnull final Embed embed) {
        return executeWebhook(embed, null, null);
    }
    
    /**
     * Send a message to this channel with the specified options.
     *
     * @param options The options for the message being sent.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> executeWebhook(@Nonnull final MessageOptions options) {
        return executeWebhook(options, null, null);
    }
    
    /**
     * Send a message to this channel with the specified content.
     *
     * @param content The text content to send.
     * @param username The username to override the webhook, if set.
     * @param avatarUrl The avatar to override the webhook, if set.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> executeWebhook(@Nonnull final String content,
                                                    @Nullable final String username, @Nullable final String avatarUrl) {
        return executeWebhook(new MessageOptions().content(content), username, avatarUrl);
    }
    
    /**
     * Send a message to this channel with the specified embed.
     *
     * @param embed The embed to send.
     * @param username The username to override the webhook, if set.
     * @param avatarUrl The avatar to override the webhook, if set.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> executeWebhook(@Nonnull final Embed embed,
                                                    @Nullable final String username, @Nullable final String avatarUrl) {
        return executeWebhook(new MessageOptions().embed(embed), username, avatarUrl);
    }
    
    /**
     * Send a message to this channel with the specified options.
     *
     * @param options The options for the message being sent.
     * @param username The username to override the webhook, if set.
     * @param avatarUrl The avatar to override the webhook, if set.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> executeWebhook(@Nonnull final MessageOptions options,
                                                    @Nullable final String username, @Nullable final String avatarUrl) {
        return catnip().rest().webhook().executeWebhook(id(), token(), username, avatarUrl, options);
    }
    
    /**
     * @return The id of the channel this webhook is for.
     */
    @Nonnull
    @CheckReturnValue
    default String channelId() {
        return Long.toUnsignedString(channelIdAsLong());
    }
    
    /**
     * @return The id of the channel this webhook is for.
     */
    @CheckReturnValue
    long channelIdAsLong();
    
    /**
     * @return The user that created this webhook.
     */
    @Nonnull
    @CheckReturnValue
    User user();
    
    /**
     * @return The name of this webhook.
     */
    @Nullable
    @CheckReturnValue
    String name();
    
    /**
     * @return The default avatar of the webhook.
     */
    @Nullable
    @CheckReturnValue
    String avatar();
    
    /**
     * @return The secure token of the webhook.
     */
    @Nonnull
    @CheckReturnValue
    String token();
    
    /**
     * @return The full URL of the webhook that can be used for requests.
     */
    @Nonnull
    @CheckReturnValue
    default String url() {
        return String.format("%s/webhooks/%s/%s", Requester.API_BASE, id(), token());
    }
    
    /**
     * Deletes the webhook.
     *
     * @return A CompletionStage that completes when the webhook is deleted.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<Void> delete() {
        PermissionUtil.checkPermissions(catnip(), guildId(), channelId(), Permission.MANAGE_WEBHOOKS);
        return catnip().rest().webhook().deleteWebhook(id());
    }
    
    /**
     * Edit this webhook.
     *
     * @return A webhook editor that can complete the editing.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default WebhookEditFields edit() {
        PermissionUtil.checkPermissions(catnip(), guildId(), channelId(), Permission.MANAGE_WEBHOOKS);
        return new WebhookEditFields(this);
    }
    
    @SuppressWarnings("unused")
    @Getter
    @Setter
    @Accessors(fluent = true)
    class WebhookEditFields {
        private final Webhook webhook;
        private String name;
        private String avatar;
        private String channelId;
        
        public WebhookEditFields(@Nullable final Webhook webhook) {
            this.webhook = webhook;
        }
        
        public WebhookEditFields() {
            this(null);
        }
        
        @Nonnull
        public CompletionStage<Webhook> submit() {
            if(webhook == null) {
                throw new IllegalStateException("Cannot submit edit without a webhook object! Please use RestWebhook directly instead");
            }
            return webhook.catnip().rest().webhook().modifyWebhook(webhook.id(), this);
        }
        
        @Nonnull
        @CheckReturnValue
        public JsonObject payload() {
            final JsonObject payload = new JsonObject();
            if(name != null && (webhook == null || !Objects.equals(name, webhook.name()))) {
                payload.put("name", name);
            }
            if(avatar != null && (webhook == null || !Objects.equals(avatar, webhook.avatar()))) {
                payload.put("avatar", avatar);
            }
            if(channelId != null && (webhook == null || !Objects.equals(channelId, webhook.channelId()))) {
                payload.put("channel_id", channelId);
            }
            return payload;
        }
    }
}

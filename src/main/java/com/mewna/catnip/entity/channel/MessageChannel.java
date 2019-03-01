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
import com.mewna.catnip.entity.impl.MessageImpl;
import com.mewna.catnip.entity.message.Embed;
import com.mewna.catnip.entity.message.Message;
import com.mewna.catnip.entity.message.MessageOptions;
import com.mewna.catnip.entity.misc.Emoji;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.PermissionUtil;
import com.mewna.catnip.util.pagination.MessagePaginator;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.concurrent.CompletionStage;

/**
 * A channel that can have messages sent in it.
 *
 * @author natanbc
 * @since 9/12/18
 */
@SuppressWarnings("unused")
public interface MessageChannel extends Channel {
    /**
     * Send a message to this channel with the specified content.
     *
     * @param content The text content to send.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> sendMessage(@Nonnull final String content) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.SEND_MESSAGES);
        }
        final CompletionStage<Message> future =  catnip().rest().channel().sendMessage(id(), content);
        // Inject guild manually because Discord does not send it in response
        if(isGuild()) {
            return future.thenApply(msg -> ((MessageImpl) msg).guildIdAsLong(asGuildChannel().guildIdAsLong()));
        }
        return future;
    }
    
    /**
     * Send a message to this channel with the specified embed.
     *
     * @param embed The embed to send
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> sendMessage(@Nonnull final Embed embed) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.SEND_MESSAGES, Permission.EMBED_LINKS);
        }
        return catnip().rest().channel().sendMessage(id(), embed);
    }
    
    /**
     * Send a message to this channel.
     *
     * @param message The message to send.
     *
     * @return A CompletionStage that completes when the message is sent.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> sendMessage(@Nonnull final Message message) {
        if(isGuild()) {
            if(!message.embeds().isEmpty()) {
                PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                        Permission.SEND_MESSAGES, Permission.EMBED_LINKS);
            } else {
                PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                        Permission.SEND_MESSAGES);
            }
        }
        return catnip().rest().channel().sendMessage(id(), message);
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
    default CompletionStage<Message> sendMessage(@Nonnull final MessageOptions options) {
        if(isGuild()) {
            if(options.hasFiles()) {
                if(options.embed() != null) {
                    PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                            Permission.SEND_MESSAGES, Permission.ATTACH_FILES, Permission.EMBED_LINKS);
                } else {
                    PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                            Permission.SEND_MESSAGES, Permission.ATTACH_FILES);
                }
            } else {
                if(options.embed() != null) {
                    PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                            Permission.SEND_MESSAGES, Permission.EMBED_LINKS);
                } else {
                    PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                            Permission.SEND_MESSAGES);
                }
            }
        }
        return catnip().rest().channel().sendMessage(id(), options);
    }
    
    /**
     * Edit the message with the given id in this channel to contain the
     * specified content.
     *
     * @param messageId The id of the message to edit.
     * @param content   The new content to set on the message.
     *
     * @return A CompletionStage that completes when the message is edited.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> editMessage(@Nonnull final String messageId, @Nonnull final String content) {
        return catnip().rest().channel().editMessage(id(), messageId, content);
    }
    
    /**
     * Edit the message with the given id in this channel to contain the
     * specified embed.
     *
     * @param messageId The id of the message to edit.
     * @param embed     The new embed to be set on the message.
     *
     * @return A CompletionStage that completes when the message is edited.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> editMessage(@Nonnull final String messageId, @Nonnull final Embed embed) {
        return catnip().rest().channel().editMessage(id(), messageId, embed);
    }
    
    /**
     * Edit the message with the given id in this channel to contain the content
     * and embed of the given message.
     *
     * @param messageId The id of the message to edit.
     * @param message   The message to set as the new message.
     *
     * @return A CompletionStage that completes when the message is edited.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Message> editMessage(@Nonnull final String messageId, @Nonnull final Message message) {
        return catnip().rest().channel().editMessage(id(), messageId, message);
    }
    
    /**
     * Delete the message with the given id in this channel.
     *
     * @param messageId The id of the message to delete.
     * @param reason The reason that will be displayed in audit log
     *
     * @return A CompletionStage that completes when the message is deleted.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteMessage(@Nonnull final String messageId, @Nullable final String reason) {
        return catnip().rest().channel().deleteMessage(id(), messageId, reason);
    }
    
    /**
     * Delete the message with the given id in this channel.
     *
     * @param messageId The id of the message to delete.
     *
     * @return A CompletionStage that completes when the message is deleted.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteMessage(@Nonnull final String messageId) {
        return deleteMessage(messageId, null);
    }
    
    /**
     * Add a reaction to the message with the given id in this channel.
     *
     * @param messageId The id of the message to add a reaction to.
     * @param emoji     The reaction to add.
     *
     * @return A CompletionStage that completes when the reaction is added.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> addReaction(@Nonnull final String messageId, @Nonnull final String emoji) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.ADD_REACTIONS, Permission.READ_MESSAGE_HISTORY);
        }
        return catnip().rest().channel().addReaction(id(), messageId, emoji);
    }
    
    /**
     * Add a reaction to the message with the given id in this channel.
     *
     * @param messageId The id of the message to add a reaction to.
     * @param emoji     The reaction to add.
     *
     * @return A CompletionStage that completes when the reaction is added.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> addReaction(@Nonnull final String messageId, @Nonnull final Emoji emoji) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.ADD_REACTIONS, Permission.READ_MESSAGE_HISTORY);
        }
        return catnip().rest().channel().addReaction(id(), messageId, emoji);
    }
    
    /**
     * Delete your own reaction on the given message.
     *
     * @param messageId The id of the message to remove a reaction from.
     * @param emoji     The reaction to remove.
     *
     * @return A CompletionStage that completes when the reaction is removed.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteOwnReaction(@Nonnull final String messageId, @Nonnull final String emoji) {
        return catnip().rest().channel().deleteOwnReaction(id(), messageId, emoji);
    }
    
    /**
     * Delete your own reaction on the given message.
     *
     * @param messageId The id of the message to remove a reaction from.
     * @param emoji     The reaction to remove.
     *
     * @return A CompletionStage that completes when the reaction is removed.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteOwnReaction(@Nonnull final String messageId, @Nonnull final Emoji emoji) {
        return catnip().rest().channel().deleteOwnReaction(id(), messageId, emoji);
    }
    
    /**
     * Delete a user's reaction on the given message.
     *
     * @param messageId The id of the message to remove a reaction from.
     * @param userId    The id of the user whose reaction is to be removed.
     * @param emoji     The reaction to remove.
     *
     * @return A CompletionStage that completes when the reaction is removed.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteUserReaction(@Nonnull final String messageId, @Nonnull final String userId,
                                                     @Nonnull final String emoji) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.MANAGE_MESSAGES);
        }
        return catnip().rest().channel().deleteUserReaction(id(), messageId, userId, emoji);
    }
    
    /**
     * Delete a user's reaction on the given message.
     *
     * @param messageId The id of the message to remove a reaction from.
     * @param userId    The id of the user whose reaction is to be removed.
     * @param emoji     The reaction to remove.
     *
     * @return A CompletionStage that completes when the reaction is removed.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteUserReaction(@Nonnull final String messageId, @Nonnull final String userId,
                                                     @Nonnull final Emoji emoji) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.MANAGE_MESSAGES);
        }
        return catnip().rest().channel().deleteUserReaction(id(), messageId, userId, emoji);
    }
    
    /**
     * Delete all reactions on the given message
     *
     * @param messageId The id of the message to remove all reactions from.
     * @return A CompletionStage that completes when the reaction is removed.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> bulkRemoveReaction(@Nonnull final String messageId) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.MANAGE_MESSAGES);
        }
        return catnip().rest().channel().deleteAllReactions(id(), messageId);
    }
    
    /**
     * Trigger the "[user] is typing..." indicator for yourself in this
     * channel.
     *
     * @return A CompletionStage that completes when the typing indicator is
     * triggered.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> triggerTypingIndicator() {
        return catnip().rest().channel().triggerTypingIndicator(id());
    }
    
    /**
     * Fetch the message with the given id from this channel.
     *
     * @param messageId The id of the message to fetch.
     *
     * @return A CompletionStage that completes when the message is fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<Message> fetchMessage(@Nonnull final String messageId) {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.READ_MESSAGE_HISTORY);
        }
        return catnip().rest().channel().getMessage(id(), messageId);
    }
    
    /**
     * Fetch the history for the channel in a paginated way.
     *
     * @return The paginator for channel history.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default MessagePaginator fetchMessages() {
        if(isGuild()) {
            PermissionUtil.checkPermissions(catnip(), asGuildChannel().guildId(), id(),
                    Permission.READ_MESSAGE_HISTORY);
        }
        return catnip().rest().channel().getChannelMessages(id());
    }
}

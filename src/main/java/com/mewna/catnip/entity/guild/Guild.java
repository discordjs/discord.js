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

package com.mewna.catnip.entity.guild;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mewna.catnip.cache.view.CacheView;
import com.mewna.catnip.cache.view.NamedCacheView;
import com.mewna.catnip.entity.Snowflake;
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.channel.Webhook;
import com.mewna.catnip.entity.impl.GuildImpl;
import com.mewna.catnip.entity.misc.CreatedInvite;
import com.mewna.catnip.entity.misc.Emoji.CustomEmoji;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.entity.user.VoiceState;
import com.mewna.catnip.entity.util.ImageOptions;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.util.PermissionUtil;
import com.mewna.catnip.util.Utils;
import io.vertx.core.json.JsonObject;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.net.URI;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.CompletionStage;

/**
 * Represents a Discord guild. A guild is colloquially referred to as a server,
 * both in the client UI and by users.
 *
 * @author natanbc
 * @since 9/6/18
 */
@SuppressWarnings("unused")
@JsonDeserialize(as = GuildImpl.class)
public interface Guild extends Snowflake {
    
    int NICKNAME_MAX_LENGTH = 32;
    
    /**
     * @return The guild's name.
     */
    @Nonnull
    @CheckReturnValue
    String name();
    
    /**
     * @return The hash of the guild's icon.
     */
    @Nullable
    @CheckReturnValue
    String icon();
    
    /**
     * Return the guild's icon's CDN URL with the specified options.
     *
     * @param options The options to configure the URL returned.
     *
     * @return The CDN URL for the guild's icon.
     */
    @Nullable
    @CheckReturnValue
    String iconUrl(@Nonnull final ImageOptions options);
    
    /**
     * @return The CDN URL for the guild's icon.
     */
    @Nullable
    @CheckReturnValue
    default String iconUrl() {
        return iconUrl(new ImageOptions());
    }
    
    /**
     * @return The splash image for the guild. May be {@code null}.
     */
    @Nullable
    @CheckReturnValue
    String splash();
    
    /**
     * The CDN URL of the guild's splash image.
     *
     * @param options The options to configure the URL returned.
     *
     * @return The CDN URL.
     */
    @Nullable
    @CheckReturnValue
    String splashUrl(@Nonnull ImageOptions options);
    
    /**
     * @return The CDN URL of the guild's splash image.
     */
    @Nullable
    @CheckReturnValue
    default String splashUrl() {
        return splashUrl(new ImageOptions());
    }
    
    /**
     * @return The self member as an user of the guild.
     */
    @Nonnull
    @CheckReturnValue
    default Member selfMember() {
        return members().getById(
                Objects.requireNonNull(catnip().selfUser(), "Self user is null. This shouldn't ever happen")
                        .idAsLong()
        );
    }
    
    /**
     * @return The guild owner of the guild.
     */
    @Nonnull
    @CheckReturnValue
    default Member owner() {
        return members().getById(ownerIdAsLong());
    }
    
    /**
     * @return Whether the guild is owned by the current user.
     */
    @CheckReturnValue
    boolean owned();
    
    /**
     * @return The id of the user who owns the guild.
     */
    @Nonnull
    @CheckReturnValue
    default String ownerId() {
        return Long.toUnsignedString(ownerIdAsLong());
    }
    
    /**
     * @return The id of the user who owns the guild.
     */
    @CheckReturnValue
    long ownerIdAsLong();
    
    /**
     * @return Total permissions for the user in the guild. Does NOT include
     * channel overrides.
     */
    @Nonnull
    @CheckReturnValue
    Set<Permission> permissions();
    
    /**
     * @return The region that the guild's voice servers are located in.
     */
    @Nonnull
    @CheckReturnValue
    String region();
    
    /**
     * @return The id of the afk voice channel for the guild.
     */
    @Nullable
    @CheckReturnValue
    default String afkChannelId() {
        final long id = afkChannelIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The id of the afk voice channel for the guild.
     */
    @CheckReturnValue
    long afkChannelIdAsLong();
    
    /**
     * @return The amount of time a user must be afk for before they're moved
     * to the afk channel.
     */
    @CheckReturnValue
    int afkTimeout();
    
    /**
     * @return Whether the guild embed is enabled.
     */
    @CheckReturnValue
    boolean embedEnabled();
    
    /**
     * @return The channel the guild embed is for, if enabled.
     */
    @Nullable
    @CheckReturnValue
    default String embedChannelId() {
        final long id = embedChannelIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The channel the guild embed is for, if enabled.
     */
    @CheckReturnValue
    long embedChannelIdAsLong();
    
    /**
     * @return The verification level set for the guild.
     */
    @Nonnull
    @CheckReturnValue
    VerificationLevel verificationLevel();
    
    /**
     * @return The notification level set for the guild.
     */
    @Nonnull
    @CheckReturnValue
    NotificationLevel defaultMessageNotifications();
    
    /**
     * @return The explicit content filter level set for the guild.
     */
    @Nonnull
    @CheckReturnValue
    ContentFilterLevel explicitContentFilter();
    
    /**
     * @return The list of features enabled for the guild.
     */
    @Nonnull
    @CheckReturnValue
    List<String> features();
    
    /**
     * @return The MFA level set for guild administrators.
     */
    @Nonnull
    @CheckReturnValue
    MFALevel mfaLevel();
    
    /**
     * @return The id of the application that created this guild.
     */
    @Nullable
    @CheckReturnValue
    default String applicationId() {
        final long id = applicationIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The id of the application that created this guild.
     */
    @CheckReturnValue
    long applicationIdAsLong();
    
    /**
     * @return Whether or not the guild's widget is enabled.
     */
    @CheckReturnValue
    boolean widgetEnabled();
    
    /**
     * @return The channel the guild's widget is set for, if enabled.
     */
    @Nullable
    @CheckReturnValue
    default String widgetChannelId() {
        final long id = widgetChannelIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The channel the guild's widget is set for, if enabled.
     */
    @CheckReturnValue
    long widgetChannelIdAsLong();
    
    /**
     * @return The id of the channel used for system messages (ex. the built-in
     * member join messages).
     */
    @Nullable
    @CheckReturnValue
    default String systemChannelId() {
        final long id = systemChannelIdAsLong();
        if(id == 0) {
            return null;
        }
        return Long.toUnsignedString(id);
    }
    
    /**
     * @return The id of the channel used for system messages (ex. the built-in
     * member join messages).
     */
    @CheckReturnValue
    long systemChannelIdAsLong();
    
    //The following fields are only sent in GUILD_CREATE
    
    /**
     * @return The date/time that the current user joined the guild at.
     */
    @CheckReturnValue
    OffsetDateTime joinedAt();
    
    /**
     * @return Whether or not this guild is considered "large."
     */
    @CheckReturnValue
    boolean large();
    
    /**
     * @return Whether or not this guild is currently unavailable.
     */
    @CheckReturnValue
    default boolean unavailable() {
        return catnip().isUnavailable(id());
    }
    
    /**
     * @return The number of users in this guild.
     */
    @Nonnegative
    @CheckReturnValue
    default long memberCount() {
        return members().size();
    }
    
    /**
     * @return All roles in this guild.
     */
    @Nonnull
    @CheckReturnValue
    default NamedCacheView<Role> roles() {
        return catnip().cache().roles(id());
    }
    
    /**
     * @return All custom emoji in this guild.
     */
    @Nonnull
    @CheckReturnValue
    default NamedCacheView<CustomEmoji> emojis() {
        return catnip().cache().emojis(id());
    }
    
    /**
     * @return All members in this guild.
     */
    @Nonnull
    @CheckReturnValue
    default NamedCacheView<Member> members() {
        return catnip().cache().members(id());
    }
    
    /**
     * @return All channels in this guild.
     */
    @Nonnull
    @CheckReturnValue
    default NamedCacheView<GuildChannel> channels() {
        return catnip().cache().channels(id());
    }
    
    /**
     * @return All voice states for this guild.
     */
    @Nonnull
    @CheckReturnValue
    default CacheView<VoiceState> voiceStates() {
        return catnip().cache().voiceStates(id());
    }
    
    // REST methods
    
    /**
     * Fetch all roles for this guild from the API.
     *
     * @return A CompletionStage that completes when the roles are fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<List<Role>> fetchRoles() {
        return catnip().rest().guild().getGuildRoles(id());
    }
    
    /**
     * Fetch all channels for this guild from the API.
     *
     * @return A CompletionStage that completes when the channels are fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<List<GuildChannel>> fetchChannels() {
        return catnip().rest().guild().getGuildChannels(id());
    }
    
    /**
     * Fetch all invites for this guild from the API.
     *
     * @return A CompletionStage that completes when the invites are fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<List<CreatedInvite>> fetchInvites() {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_GUILD);
        return catnip().rest().guild().getGuildInvites(id());
    }
    
    /**
     * Fetch all webhooks for this guild.
     *
     * @return A CompletionStage that completes when the webhooks are fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<List<Webhook>> fetchWebhooks() {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_WEBHOOKS);
        return catnip().rest().webhook().getGuildWebhooks(id());
    }
    
    /**
     * Fetch all emojis for this guild.
     *
     * @return A CompletionStage that completes when the emojis are fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<List<CustomEmoji>> fetchEmojis() {
        return catnip().rest().emoji().listGuildEmojis(id());
    }
    
    /**
     * Fetch a single emoji from this guild.
     *
     * @param emojiId The id of the emoji to fetch.
     *
     * @return A CompletionStage that completes when the emoji is fetched.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<CustomEmoji> fetchEmoji(@Nonnull final String emojiId) {
        return catnip().rest().emoji().getGuildEmoji(id(), emojiId);
    }
    
    /**
     * Create a new emoji on the guild.
     *
     * @param name   The new emoji's name.
     * @param image  The image for the new emoji.
     * @param roles  The roles that can use the new emoji.
     * @param reason The reason that will be displayed in audit log.
     *
     * @return A CompletionStage that completes when the emoji is created.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<CustomEmoji> createEmoji(@Nonnull final String name, @Nonnull final byte[] image,
                                                     @Nonnull final Collection<String> roles, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_EMOJI);
        return catnip().rest().emoji().createGuildEmoji(id(), name, image, roles, reason);
    }
    
    /**
     * Create a new emoji on the guild.
     *
     * @param name  The new emoji's name.
     * @param image The image for the new emoji.
     * @param roles The roles that can use the new emoji.
     *
     * @return A CompletionStage that completes when the emoji is created.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<CustomEmoji> createEmoji(@Nonnull final String name, @Nonnull final byte[] image,
                                                     @Nonnull final Collection<String> roles) {
        return createEmoji(name, image, roles, null);
    }
    
    /**
     * Create a new emoji on the guild.
     *
     * @param name      The new emoji's name.
     * @param imageData The image for the new emoji.
     * @param roles     The roles that can use the new emoji.
     * @param reason    The reason that will be displayed in audit log.
     *
     * @return A CompletionStage that completes when the emoji is created.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<CustomEmoji> createEmoji(@Nonnull final String name, @Nonnull final URI imageData,
                                                     @Nonnull final Collection<String> roles, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_EMOJI);
        return catnip().rest().emoji().createGuildEmoji(id(), name, imageData, roles, reason);
    }
    
    /**
     * Create a new emoji on the guild.
     *
     * @param name      The new emoji's name.
     * @param imageData The image for the new emoji.
     * @param roles     The roles that can use the new emoji.
     *
     * @return A CompletionStage that completes when the emoji is created.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<CustomEmoji> createEmoji(@Nonnull final String name, @Nonnull final URI imageData,
                                                     @Nonnull final Collection<String> roles) {
        return createEmoji(name, imageData, roles, null);
    }
    
    /**
     * Modify the given emoji.
     *
     * @param emojiId The id of the emoji to modify.
     * @param name    The name of the emoji. To not change it, pass the old name.
     * @param roles   The roles that can use the emoji. To not change it, pass
     *                the old roles.
     * @param reason  The reason that will be displayed in audit log.
     *
     * @return A CompletionStage that completes when the emoji is modified.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<CustomEmoji> modifyEmoji(@Nonnull final String emojiId, @Nonnull final String name,
                                                     @Nonnull final Collection<String> roles, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_EMOJI);
        return catnip().rest().emoji().modifyGuildEmoji(id(), emojiId, name, roles, reason);
    }
    
    /**
     * Modify the given emoji.
     *
     * @param emojiId The id of the emoji to modify.
     * @param name    The name of the emoji. To not change it, pass the old name.
     * @param roles   The roles that can use the emoji. To not change it, pass
     *                the old roles.
     *
     * @return A CompletionStage that completes when the emoji is modified.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<CustomEmoji> modifyEmoji(@Nonnull final String emojiId, @Nonnull final String name,
                                                     @Nonnull final Collection<String> roles) {
        return modifyEmoji(emojiId, name, roles, null);
    }
    
    /**
     * Delete the given emoji from the guild.
     *
     * @param emojiId The id of the emoji to delete.
     * @param reason  The reason that will be displayed in audit log.
     *
     * @return A CompletionStage that completes when the emoji is deleted.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteEmoji(@Nonnull final String emojiId, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_EMOJI);
        return catnip().rest().emoji().deleteGuildEmoji(id(), emojiId, reason);
    }
    
    /**
     * Delete the given emoji from the guild.
     *
     * @param emojiId The id of the emoji to delete.
     *
     * @return A CompletionStage that completes when the emoji is deleted.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> deleteEmoji(@Nonnull final String emojiId) {
        return deleteEmoji(emojiId, null);
    }
    
    /**
     * Leave this guild.
     *
     * @return A CompletionStage that completes when the guild is left.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> leave() {
        return catnip().rest().user().leaveGuild(id());
    }
    
    /**
     * Delete this guild.
     *
     * @return A CompletionStage that completes when the guild is deleted.
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> delete() {
        return catnip().rest().guild().deleteGuild(id());
    }
    
    /**
     * Closes the voice connection for this guild. This method is equivalent to
     * {@code guild.catnip().{@link com.mewna.catnip.Catnip#closeVoiceConnection(String) closeVoiceConnection}(guild.id())}
     *
     * @see com.mewna.catnip.Catnip#closeVoiceConnection(String)
     */
    @JsonIgnore
    default void closeVoiceConnection() {
        catnip().closeVoiceConnection(id());
    }
    
    /**
     * Edit this guild.
     *
     * @return A guild editor that can complete the editing.
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default GuildEditFields edit() {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_GUILD);
        return new GuildEditFields(this);
    }
    
    /**
     * Bans a user from a guild.
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId            The id of the user to ban.
     * @param reason            The reason of the ban.
     * @param deleteMessageDays The history of messages, in days, that will be deleted
     *
     * @return A CompletionStage that completes when the member got banned
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> ban(@Nonnull final String userId,
                                      @Nullable final String reason,
                                      @Nonnegative final int deleteMessageDays) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.BAN_MEMBERS);
        PermissionUtil.checkHierarchy(Objects.requireNonNull(catnip().cache().member(id(), userId)), this);
        return catnip().rest().guild().createGuildBan(id(), userId, reason, deleteMessageDays);
    }
    
    /**
     * Bans a user from a guild.
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId            The id of the user to ban.
     * @param reason            The reason of the ban.
     * @param deleteMessageDays The history of messages, in days, that will be deleted
     *
     * @return A CompletionStage that completes when the member got banned
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> ban(final long userId,
                                      @Nullable final String reason,
                                      @Nonnegative final int deleteMessageDays) {
        return ban(Long.toUnsignedString(userId), reason, deleteMessageDays);
    }
    
    /**
     * Bans a user from a guild.
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId            The id of the user to ban.
     * @param deleteMessageDays The history of messages, in days, that will be deleted
     *
     * @return A CompletionStage that completes when the member got banned
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> ban(final long userId,
                                      @Nonnegative final int deleteMessageDays) {
        return ban(userId, null, deleteMessageDays);
    }
    
    /**
     * Bans a user from a guild.
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param member            The member to ban.
     * @param reason            The reason of the ban.
     * @param deleteMessageDays The history of messages, in days, that will be deleted
     *
     * @return A CompletionStage that completes when the member got banned
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> ban(@Nonnull final Member member,
                                      @Nullable final String reason,
                                      @Nonnegative final int deleteMessageDays) {
        return ban(member.id(), reason, deleteMessageDays);
    }
    
    /**
     * Removes a users ban from the Guild
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to unban
     * @param reason The reason for the unban
     *
     * @return A CompletionStage that completes when the ban got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> unban(@Nonnull final String userId, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.BAN_MEMBERS);
        return catnip().rest().guild().removeGuildBan(id(), userId, reason);
    }
    
    /**
     * Removes a users ban from the Guild
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to unban
     *
     * @return A CompletionStage that completes when the ban got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> unban(@Nonnull final String userId) {
        return unban(userId, null);
    }
    
    /**
     * Removes a users ban from the Guild
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to unban
     * @param reason The reason for the unban
     *
     * @return A CompletionStage that completes when the ban got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> unban(final long userId, @Nullable final String reason) {
        return unban(Long.toUnsignedString(userId), reason);
    }
    
    /**
     * Removes a users ban from the Guild
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to unban
     *
     * @return A CompletionStage that completes when the ban got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> unban(final long userId) {
        return unban(userId, null);
    }
    
    /**
     * Removes a users ban from the Guild
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param user   The the user to unban
     * @param reason The that will be displayed in audit log
     *
     * @return A CompletionStage that completes when the ban got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> unban(@Nonnull final User user, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.BAN_MEMBERS);
        return catnip().rest().guild().removeGuildBan(id(), user.id(), reason);
    }
    
    /**
     * Removes a users ban from the Guild
     * Needs {@link Permission#BAN_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param user The the user to unban
     *
     * @return A CompletionStage that completes when the ban got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> unban(@Nonnull final User user) {
        return unban(user, null);
    }
    
    /**
     * Kicks a member from the Guild.
     * Needs {@link Permission#KICK_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to kick
     * @param reason The reason for the kick
     *
     * @return A CompletionStage that is finished when the user got kicked
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> kick(@Nonnull final String userId, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.KICK_MEMBERS);
        PermissionUtil.checkHierarchy(Objects.requireNonNull(catnip().cache().member(id(), userId)), this);
        return catnip().rest().guild().removeGuildMember(id(), userId, reason);
    }
    
    /**
     * Kicks a member from the Guild.
     * Needs {@link Permission#KICK_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to kick
     *
     * @return A CompletionStage that is finished when the user got kicked
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> kick(@Nonnull final String userId) {
        return kick(userId, null);
    }
    
    /**
     * Kicks a member from the Guild.
     * Needs {@link Permission#KICK_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to kick
     * @param reason The reason for the kick
     *
     * @return A CompletionStage that is finished when the user got kicked
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> kick(final long userId, @Nullable final String reason) {
        return kick(Long.toUnsignedString(userId), reason);
    }
    
    /**
     * Kicks a member from the Guild.
     * Needs {@link Permission#KICK_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param userId The id of the user to kick
     *
     * @return A CompletionStage that is finished when the user got kicked
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> kick(final long userId) {
        return kick(userId, null);
    }
    
    /**
     * Kicks a member from the Guild.
     * Needs {@link Permission#KICK_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param member The member to kick
     * @param reason The reason for the kick
     *
     * @return A CompletionStage that is finished when the user got kicked
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> kick(final Member member, @Nullable final String reason) {
        return kick(member.id(), reason);
    }
    
    /**
     * Kicks a member from the Guild.
     * Needs {@link Permission#KICK_MEMBERS} and permission to interact with the target
     * {@link PermissionUtil#canInteract(Member, Member)}
     *
     * @param member The member to kick
     *
     * @return A CompletionStage that is finished when the user got kicked
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> kick(final Member member) {
        return kick(member.id(), null);
    }
    
    /**
     * Changes the nick of the bots user on the guild
     * Needs {@link Permission#CHANGE_NICKNAME}
     *
     * @param nickname The new nickname
     * @param reason   The reason of the nickname change
     *
     * @return A CompletionStage containing the new nickname
     *
     * @throws IllegalArgumentException If the nickname is longer than {@link Guild#NICKNAME_MAX_LENGTH}
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<String> changeNickName(@Nonnull final String nickname, @Nullable final String reason) {
        if(nickname.length() > NICKNAME_MAX_LENGTH) {
            throw new IllegalArgumentException("Nickname must not be longer than" + NICKNAME_MAX_LENGTH);
        }
        PermissionUtil.checkPermissions(catnip(), id(), Permission.CHANGE_NICKNAME);
        return catnip().rest().guild().modifyCurrentUsersNick(id(), nickname, reason);
    }
    
    /**
     * Changes the nick of the bots user on the guild
     * Needs {@link Permission#CHANGE_NICKNAME}
     *
     * @param nickname The new nickname
     *
     * @return A CompletionStage containing the new nickname
     *
     * @throws IllegalArgumentException If the nickname is longer than {@link Guild#NICKNAME_MAX_LENGTH}
     */
    @Nonnull
    @JsonIgnore
    @CheckReturnValue
    default CompletionStage<String> changeNickName(@Nonnull final String nickname) {
        return changeNickName(nickname, null);
    }
    
    /**
     * Adds a role to a member.
     * Needs {@link Permission#MANAGE_ROLES} and permission to interact with the role
     * {@link PermissionUtil#canInteract(Member, Role)}
     *
     * @param role   The role to assign
     * @param member The member to assign the role to
     * @param reason The reason that will be displayed in audit log
     *
     * @return A CompletionStage that completes when the role got added
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> addRoleToMember(@Nonnull final Role role, @Nonnull final Member member, @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_ROLES);
        PermissionUtil.checkHierarchy(role, this);
        return catnip().rest().guild().addGuildMemberRole(id(), member.id(), role.id(), reason);
    }
    
    /**
     * Adds a role to a member.
     * Needs {@link Permission#MANAGE_ROLES} and permission to interact with the role
     * {@link PermissionUtil#canInteract(Member, Role)}
     *
     * @param role   The role to assign
     * @param member The member to assign the role to
     *
     * @return A CompletionStage that completes when the role got added
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> addRoleToMember(@Nonnull final Role role, @Nonnull final Member member) {
        return addRoleToMember(role, member, null);
    }
    
    /**
     * Removes a role from a member.
     * Needs {@link Permission#MANAGE_ROLES} and permission to interact with the role
     * {@link PermissionUtil#canInteract(Member, Role)}
     *
     * @param role   The role to remove
     * @param member The member to remove the role from
     * @param reason The reason that will be displayed in audit log
     *
     * @return A CompletionStage that completes when the role got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> removeRoleFromMember(@Nonnull final Role role, @Nonnull final Member member,
                                                       @Nullable final String reason) {
        PermissionUtil.checkPermissions(catnip(), id(), Permission.MANAGE_ROLES);
        PermissionUtil.checkHierarchy(role, this);
        return catnip().rest().guild().removeGuildMemberRole(id(), member.id(), role.id(), reason);
    }
    
    /**
     * Removes a role from a member.
     * Needs {@link Permission#MANAGE_ROLES} and permission to interact with the role
     * {@link PermissionUtil#canInteract(Member, Role)}
     *
     * @param role   The role to remove
     * @param member The member to remove the role from
     *
     * @return A CompletionStage that completes when the role got removed
     */
    @Nonnull
    @JsonIgnore
    default CompletionStage<Void> removeRoleFromMember(@Nonnull final Role role, @Nonnull final Member member) {
        return removeRoleFromMember(role, member, null);
    }
    
    /**
     * The notification level for a guild.
     */
    enum NotificationLevel {
        /**
         * Users get notifications for all messages.
         */
        ALL_MESSAGES(0),
        /**
         * Users only get notifications for mentions.
         */
        ONLY_MENTIONS(1);
        
        @Getter
        private final int key;
        
        NotificationLevel(final int key) {
            this.key = key;
        }
        
        @Nonnull
        public static NotificationLevel byKey(final int key) {
            for(final NotificationLevel level : values()) {
                if(level.key == key) {
                    return level;
                }
            }
            throw new IllegalArgumentException("No verification level for key " + key);
        }
    }
    
    /**
     * The content filter level for a guild.
     */
    enum ContentFilterLevel {
        /**
         * No messages are filtered.
         */
        DISABLED(0),
        /**
         * Only messages from members with no roles are filtered.
         */
        MEMBERS_WITHOUT_ROLES(1),
        /**
         * Messages from all members are filtered.
         */
        ALL_MEMBERS(2);
        
        @Getter
        private final int key;
        
        ContentFilterLevel(final int key) {
            this.key = key;
        }
        
        @Nonnull
        public static ContentFilterLevel byKey(final int key) {
            for(final ContentFilterLevel level : values()) {
                if(level.key == key) {
                    return level;
                }
            }
            throw new IllegalArgumentException("No content filter level for key " + key);
        }
    }
    
    /**
     * The 2FA level required for this guild.
     */
    enum MFALevel {
        /**
         * 2FA is not required.
         */
        NONE(0),
        /**
         * 2FA is required for admin actions.
         */
        ELEVATED(1);
        
        @Getter
        private final int key;
        
        MFALevel(final int key) {
            this.key = key;
        }
        
        @Nonnull
        public static MFALevel byKey(final int key) {
            for(final MFALevel level : values()) {
                if(level.key == key) {
                    return level;
                }
            }
            throw new IllegalArgumentException("No MFA level for key " + key);
        }
    }
    
    /**
     * The verification level for a guild.
     */
    enum VerificationLevel {
        /**
         * No restrictions.
         */
        NONE(0),
        /**
         * Members must have a verified email on their account.
         */
        LOW(1),
        /**
         * Members must also be registered on Discord for more than 5 minutes.
         */
        MEDIUM(2),
        /**
         * Members must also have been a member of this guild for more than 10
         * minutes.
         */
        HIGH(3),
        /**
         * Members must also have a verified phone number on their account.
         */
        VERY_HIGH(4);
        
        @Getter
        private final int key;
        
        VerificationLevel(final int key) {
            this.key = key;
        }
        
        @Nonnull
        public static VerificationLevel byKey(final int key) {
            for(final VerificationLevel level : values()) {
                if(level.key == key) {
                    return level;
                }
            }
            throw new IllegalArgumentException("No verification level for key " + key);
        }
    }
    
    @SuppressWarnings("unused")
    @Getter
    @Setter
    @Accessors(fluent = true)
    class GuildEditFields {
        private final Guild guild;
        private String name;
        private String region;
        private VerificationLevel verificationLevel;
        private NotificationLevel defaultMessageNotifications;
        private ContentFilterLevel explicitContentFilter;
        private String afkChannelId;
        private Integer afkTimeout;
        private URI icon;
        private String ownerId;
        private URI splash;
        private String systemChannelId;
        
        public GuildEditFields(@Nullable final Guild guild) {
            this.guild = guild;
        }
        
        public GuildEditFields() {
            this(null);
        }
        
        @Nonnull
        public GuildEditFields icon(@Nullable final URI iconData) {
            if(iconData != null) {
                Utils.validateImageUri(iconData);
            }
            icon = iconData;
            return this;
        }
        
        @Nonnull
        public GuildEditFields icon(@Nullable final byte[] iconData) {
            return icon(iconData == null ? null : Utils.asImageDataUri(iconData));
        }
        
        @Nonnull
        public GuildEditFields splash(@Nullable final URI splashData) {
            if(splashData != null) {
                Utils.validateImageUri(splashData);
            }
            splash = splashData;
            return this;
        }
        
        @Nonnull
        public GuildEditFields splash(@Nullable final byte[] splashData) {
            return splash(splashData == null ? null : Utils.asImageDataUri(splashData));
        }
        
        @Nonnull
        public CompletionStage<Guild> submit() {
            if(guild == null) {
                throw new IllegalStateException("Cannot submit edit without a guild object! Please use RestGuild directly instead");
            }
            return guild.catnip().rest().guild().modifyGuild(guild.id(), this);
        }
        
        @Nonnull
        @CheckReturnValue
        public JsonObject payload() {
            final JsonObject payload = new JsonObject();
            if(name != null && (guild == null || !Objects.equals(name, guild.name()))) {
                payload.put("name", name);
            }
            if(region != null && (guild == null || !Objects.equals(region, guild.region()))) {
                payload.put("region", region);
            }
            if(verificationLevel != null && (guild == null || verificationLevel != guild.verificationLevel())) {
                payload.put("verification_level", verificationLevel.getKey());
            }
            if(defaultMessageNotifications != null && (guild == null || defaultMessageNotifications != guild.defaultMessageNotifications())) {
                payload.put("default_message_notifications", defaultMessageNotifications.getKey());
            }
            if(explicitContentFilter != null && (guild == null || explicitContentFilter != guild.explicitContentFilter())) {
                payload.put("explicit_content_filter", explicitContentFilter.getKey());
            }
            if(afkChannelId != null && (guild == null || !Objects.equals(afkChannelId, guild.afkChannelId()))) {
                payload.put("afk_channel_id", afkChannelId);
            }
            if(afkTimeout != null && (guild == null || !Objects.equals(afkTimeout, guild.afkTimeout()))) {
                payload.put("afk_timeout", afkTimeout);
            }
            if(icon != null) {
                payload.put("icon", icon.toString());
            }
            if(ownerId != null && (guild == null || !Objects.equals(ownerId, guild.ownerId()))) {
                payload.put("owner_id", ownerId);
            }
            if(splash != null) {
                payload.put("splash", splash.toString());
            }
            if(systemChannelId != null && (guild == null || !Objects.equals(systemChannelId, guild.systemChannelId()))) {
                payload.put("system_channel_id", systemChannelId);
            }
            return payload;
        }
    }
}

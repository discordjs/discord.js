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

package com.mewna.catnip.entity.impl;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.channel.*;
import com.mewna.catnip.entity.channel.Channel.ChannelType;
import com.mewna.catnip.entity.guild.*;
import com.mewna.catnip.entity.guild.Guild.ContentFilterLevel;
import com.mewna.catnip.entity.guild.Guild.MFALevel;
import com.mewna.catnip.entity.guild.Guild.NotificationLevel;
import com.mewna.catnip.entity.guild.Guild.VerificationLevel;
import com.mewna.catnip.entity.guild.Invite.InviteChannel;
import com.mewna.catnip.entity.guild.Invite.InviteGuild;
import com.mewna.catnip.entity.guild.Invite.Inviter;
import com.mewna.catnip.entity.guild.PermissionOverride.OverrideType;
import com.mewna.catnip.entity.guild.audit.ActionType;
import com.mewna.catnip.entity.guild.audit.AuditLogChange;
import com.mewna.catnip.entity.guild.audit.AuditLogEntry;
import com.mewna.catnip.entity.guild.audit.OptionalEntryInfo;
import com.mewna.catnip.entity.impl.EmbedImpl.*;
import com.mewna.catnip.entity.impl.InviteImpl.InviteChannelImpl;
import com.mewna.catnip.entity.impl.InviteImpl.InviteGuildImpl;
import com.mewna.catnip.entity.impl.InviteImpl.InviterImpl;
import com.mewna.catnip.entity.impl.MessageImpl.AttachmentImpl;
import com.mewna.catnip.entity.impl.MessageImpl.ReactionImpl;
import com.mewna.catnip.entity.impl.PresenceImpl.*;
import com.mewna.catnip.entity.message.*;
import com.mewna.catnip.entity.message.Embed.*;
import com.mewna.catnip.entity.message.Message.Attachment;
import com.mewna.catnip.entity.message.Message.Reaction;
import com.mewna.catnip.entity.misc.*;
import com.mewna.catnip.entity.misc.Emoji.CustomEmoji;
import com.mewna.catnip.entity.misc.Emoji.UnicodeEmoji;
import com.mewna.catnip.entity.user.*;
import com.mewna.catnip.entity.user.Presence.*;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.entity.voice.VoiceServerUpdate;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static com.mewna.catnip.util.JsonUtil.*;

/**
 * @author natanbc
 * @since 9/2/18.
 */
@SuppressWarnings({"WeakerAccess", "unused", "OverlyCoupledClass"})
public final class EntityBuilder {
    private static final JsonArray EMPTY_JSON_ARRAY = new JsonArray();
    
    @SuppressWarnings("FieldCanBeLocal")
    private final Catnip catnip;
    
    public EntityBuilder(final Catnip catnip) {
        this.catnip = catnip;
    }
    
    @CheckReturnValue
    private static boolean isInvalid(@Nullable final JsonObject object, @Nonnull final String key) {
        return object == null || !object.containsKey(key);
    }
    
    @Nullable
    @CheckReturnValue
    private static OffsetDateTime parseTimestamp(@Nullable final CharSequence raw) {
        return raw == null ? null : OffsetDateTime.parse(raw);
    }
    
    @Nonnull
    @CheckReturnValue
    private static JsonObject embedFooterToJson(final Footer footer) {
        return new JsonObject().put("icon_url", footer.iconUrl()).put("text", footer.text());
    }
    
    @Nonnull
    @CheckReturnValue
    private static JsonObject embedImageToJson(final Image image) {
        return new JsonObject().put("url", image.url());
    }
    
    @Nonnull
    @CheckReturnValue
    private static JsonObject embedThumbnailToJson(final Thumbnail thumbnail) {
        return new JsonObject().put("url", thumbnail.url());
    }
    
    @Nonnull
    @CheckReturnValue
    private static JsonObject embedAuthorToJson(final Author author) {
        return new JsonObject().put("name", author.name()).put("url", author.url()).put("icon_url", author.iconUrl());
    }
    
    @Nonnull
    @CheckReturnValue
    private static JsonObject embedFieldToJson(final Field field) {
        return new JsonObject().put("name", field.name()).put("value", field.value()).put("inline", field.inline());
    }
    
    @Nonnull
    @CheckReturnValue
    private static FieldImpl createField(@Nonnull final JsonObject data) {
        return FieldImpl.builder()
                .name(data.getString("name"))
                .value(data.getString("value"))
                .inline(data.getBoolean("inline", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    @SuppressWarnings("ConstantConditions")
    public JsonObject embedToJson(final Embed embed) {
        final JsonObject o = new JsonObject();
        final OffsetDateTime timestamp = embed.timestamp(); // to avoid parsing timestamp twice
        if(timestamp != null) {
            o.put("timestamp", timestamp.format(DateTimeFormatter.ISO_INSTANT));
        }
        
        if(embed.title() != null) {
            o.put("title", embed.title());
        }
        if(embed.description() != null) {
            o.put("description", embed.description());
        }
        if(embed.url() != null) {
            o.put("url", embed.url());
        }
        if(embed.color() != null) {
            o.put("color", embed.color());
        }
        if(embed.footer() != null) {
            o.put("footer", embedFooterToJson(embed.footer()));
        }
        if(embed.image() != null) {
            o.put("image", embedImageToJson(embed.image()));
        }
        if(embed.thumbnail() != null) {
            o.put("thumbnail", embedThumbnailToJson(embed.thumbnail()));
        }
        if(embed.author() != null) {
            o.put("author", embedAuthorToJson(embed.author()));
        }
        if(!embed.fields().isEmpty()) {
            final JsonArray array = new JsonArray();
            for(final Field field : embed.fields()) {
                array.add(embedFieldToJson(field));
            }
            o.put("fields", array);
        }
        
        return o;
    }
    
    @Nonnull
    @CheckReturnValue
    public Embed createEmbed(final JsonObject data) {
        final JsonObject footerRaw = data.getJsonObject("footer");
        final FooterImpl footer = isInvalid(footerRaw, "text") ? null : FooterImpl.builder()
                .text(footerRaw.getString("text"))
                .iconUrl(footerRaw.getString("icon_url"))
                .proxyIconUrl(footerRaw.getString("proxy_icon_url"))
                .build();
        
        final JsonObject imageRaw = data.getJsonObject("image");
        final ImageImpl image = isInvalid(imageRaw, "url") ? null : ImageImpl.builder()
                .url(imageRaw.getString("url"))
                .proxyUrl(imageRaw.getString("proxy_url"))
                .height(imageRaw.getInteger("height", -1))
                .width(imageRaw.getInteger("width", -1))
                .build();
        
        final JsonObject thumbnailRaw = data.getJsonObject("thumbnail");
        final ThumbnailImpl thumbnail = isInvalid(thumbnailRaw, "url") ? null : ThumbnailImpl.builder()
                .url(thumbnailRaw.getString("url"))
                .proxyUrl(thumbnailRaw.getString("proxy_url"))
                .height(thumbnailRaw.getInteger("height", -1))
                .width(thumbnailRaw.getInteger("width", -1))
                .build();
        
        final JsonObject videoRaw = data.getJsonObject("video");
        final VideoImpl video = isInvalid(videoRaw, "url") ? null : VideoImpl.builder()
                .url(videoRaw.getString("url"))
                .height(videoRaw.getInteger("height", -1))
                .width(videoRaw.getInteger("width", -1))
                .build();
        
        final JsonObject providerRaw = data.getJsonObject("provider");
        final ProviderImpl provider = isInvalid(providerRaw, "url") ? null : ProviderImpl.builder()
                .name(providerRaw.getString("name"))
                .url(providerRaw.getString("url"))
                .build();
        
        final JsonObject authorRaw = data.getJsonObject("author");
        final AuthorImpl author = isInvalid(authorRaw, "name") ? null : AuthorImpl.builder()
                .name(authorRaw.getString("name"))
                .url(authorRaw.getString("url"))
                .iconUrl(authorRaw.getString("icon_url"))
                .proxyIconUrl(authorRaw.getString("proxy_icon_url"))
                .build();
        
        return EmbedImpl.builder()
                .title(data.getString("title"))
                .type(EmbedType.byKey(data.getString("type")))
                .description(data.getString("description"))
                .url(data.getString("url"))
                .timestamp(data.getString("timestamp"))
                .color(data.getInteger("color", null))
                .footer(footer)
                .image(image)
                .thumbnail(thumbnail)
                .video(video)
                .provider(provider)
                .author(author)
                .fields(toList(data.getJsonArray("fields"), EntityBuilder::createField))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public TextChannel createTextChannel(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        final String parentId = data.getString("parent_id");
        return TextChannelImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .guildIdAsLong(Long.parseUnsignedLong(guildId))
                .position(data.getInteger("position", -1))
                .parentIdAsLong(parentId == null ? 0 : Long.parseUnsignedLong(parentId))
                .overrides(toList(data.getJsonArray("permission_overwrites"), this::createPermissionOverride))
                .topic(data.getString("topic"))
                .nsfw(data.getBoolean("nsfw", false))
                .rateLimitPerUser(data.getInteger("rate_limit_per_user", 0))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public VoiceChannel createVoiceChannel(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        final String parentId = data.getString("parent_id");
        return VoiceChannelImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .guildIdAsLong(Long.parseUnsignedLong(guildId))
                .position(data.getInteger("position", -1))
                .parentIdAsLong(parentId == null ? 0 : Long.parseUnsignedLong(parentId))
                .overrides(toList(data.getJsonArray("permission_overwrites"), this::createPermissionOverride))
                .bitrate(data.getInteger("bitrate", 0))
                .userLimit(data.getInteger("user_limit", 0))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Category createCategory(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        return CategoryImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .guildIdAsLong(Long.parseUnsignedLong(guildId))
                .position(data.getInteger("position", -1))
                .overrides(toList(data.getJsonArray("permission_overwrites"), this::createPermissionOverride))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public UserDMChannel createUserDM(@Nonnull final JsonObject data) {
        return UserDMChannelImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .userIdAsLong(Long.parseUnsignedLong(data.getJsonArray("recipients").getJsonObject(0).getString("id")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public GroupDMChannel createGroupDM(@Nonnull final JsonObject data) {
        return GroupDMChannelImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .recipients(toList(data.getJsonArray("recipients"), this::createUser))
                .icon(data.getString("icon"))
                .ownerIdAsLong(Long.parseUnsignedLong(data.getString("owner_id")))
                .applicationIdAsLong(Long.parseUnsignedLong(data.getString("application_id")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public GuildChannel createGuildChannel(@Nonnull final JsonObject data) {
        return createGuildChannel(data.getString("guild_id"), data);
    }
    
    @Nonnull
    @CheckReturnValue
    public GuildChannel createGuildChannel(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        final ChannelType type = ChannelType.byKey(data.getInteger("type"));
        switch(type) {
            case TEXT:
                return createTextChannel(guildId, data);
            case VOICE:
                return createVoiceChannel(guildId, data);
            case CATEGORY:
                return createCategory(guildId, data);
            default:
                throw new UnsupportedOperationException("Unsupported channel type " + type);
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public DMChannel createDMChannel(@Nonnull final JsonObject data) {
        final ChannelType type = ChannelType.byKey(data.getInteger("type"));
        switch(type) {
            case DM:
                return createUserDM(data);
            case GROUP_DM:
                return createGroupDM(data);
            default:
                throw new UnsupportedOperationException("Unsupported channel type " + type);
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public Channel createChannel(@Nonnull final JsonObject data) {
        final ChannelType type = ChannelType.byKey(data.getInteger("type"));
        if(type.isGuild()) {
            return createGuildChannel(data);
        } else {
            return createDMChannel(data);
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public ChannelPinsUpdate createChannelPinsUpdate(@Nonnull final JsonObject data) {
        return ChannelPinsUpdateImpl.builder()
                .catnip(catnip)
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .lastPinTimestamp(data.getString("last_pin_timestamp"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public PermissionOverride createPermissionOverride(@Nonnull final JsonObject data) {
        return PermissionOverrideImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .type(OverrideType.byKey(data.getString("type")))
                .allowRaw(data.getLong("allow", 0L))
                .denyRaw(data.getLong("deny", 0L))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Role createRole(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        return RoleImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .guildIdAsLong(Long.parseUnsignedLong(guildId))
                .name(data.getString("name"))
                .color(data.getInteger("color"))
                .hoist(data.getBoolean("hoist"))
                .position(data.getInteger("position"))
                .permissionsRaw(data.getLong("permissions", 0L))
                .managed(data.getBoolean("managed"))
                .mentionable(data.getBoolean("mentionable"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public PartialRole createPartialRole(@Nonnull final String guildId, @Nonnull final String roleId) {
        return PartialRoleImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(roleId))
                .guildIdAsLong(Long.parseUnsignedLong(guildId))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public User createUser(@Nonnull final JsonObject data) {
        return UserImpl.builder()
                .catnip(catnip)
                .username(data.getString("username"))
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .discriminator(data.getString("discriminator"))
                .avatar(data.getString("avatar", null))
                .bot(data.getBoolean("bot", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Presence createPresence(@Nonnull final JsonObject data) {
        final JsonObject clientStatus = data.getJsonObject("client_status");
        final String mobileStatusString = clientStatus == null ? null : clientStatus.getString("mobile");
        final String webStatusString = clientStatus == null ? null : clientStatus.getString("web");
        final String desktopStatusString = clientStatus == null ? null : clientStatus.getString("desktop");
        return PresenceImpl.builder()
                .catnip(catnip)
                .status(OnlineStatus.fromString(data.getString("status")))
                .activity(createActivity(data.getJsonObject("game", null)))
                .mobileStatus(mobileStatusString != null ? OnlineStatus.fromString(mobileStatusString) : null)
                .webStatus(webStatusString != null ? OnlineStatus.fromString(webStatusString) : null)
                .desktopStatus(desktopStatusString != null ? OnlineStatus.fromString(desktopStatusString) : null)
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public PresenceUpdate createPresenceUpdate(@Nonnull final JsonObject data) {
        final JsonObject clientStatus = data.getJsonObject("client_status");
        final String mobileStatusString = clientStatus == null ? null : clientStatus.getString("mobile");
        final String webStatusString = clientStatus == null ? null : clientStatus.getString("web");
        final String desktopStatusString = clientStatus == null ? null : clientStatus.getString("desktop");
        return PresenceUpdateImpl.builder()
                .catnip(catnip)
                .status(OnlineStatus.fromString(data.getString("status")))
                .activity(createActivity(data.getJsonObject("game", null)))
                .idAsLong(Long.parseUnsignedLong(data.getJsonObject("user").getString("id")))
                .guildIdAsLong(Long.parseUnsignedLong(data.getString("guild_id")))
                .roles(toStringSet(data.getJsonArray("roles")))
                .nick(data.getString("nick"))
                .mobileStatus(mobileStatusString != null ? OnlineStatus.fromString(mobileStatusString) : null)
                .webStatus(webStatusString != null ? OnlineStatus.fromString(webStatusString) : null)
                .desktopStatus(desktopStatusString != null ? OnlineStatus.fromString(desktopStatusString) : null)
                .build();
    }
    
    @Nullable
    @CheckReturnValue
    public Activity createActivity(@Nullable final JsonObject data) {
        if(data == null) {
            return null;
        } else {
            final String applicationId = data.getString("application_id");
            return ActivityImpl.builder()
                    .name(data.getString("name"))
                    .type(ActivityType.byId(data.getInteger("type")))
                    .url(data.getString("url"))
                    .timestamps(createTimestamps(data.getJsonObject("timestamps", null)))
                    .applicationIdAsLong(applicationId == null ? 0 : Long.parseUnsignedLong(applicationId))
                    .details(data.getString("details"))
                    .state(data.getString("state"))
                    .party(createParty(data.getJsonObject("party", null)))
                    .assets(createAssets(data.getJsonObject("assets", null)))
                    .secrets(createSecrets(data.getJsonObject("secrets", null)))
                    .instance(data.getBoolean("instance", false))
                    .flags(ActivityFlag.fromInt(data.getInteger("flags", 0)))
                    .build();
        }
    }
    
    @Nullable
    @CheckReturnValue
    public ActivityTimestamps createTimestamps(@Nullable final JsonObject data) {
        if(data == null) {
            return null;
        } else {
            // Defend against stringly-typed timestamps.
            // I asked Jake, he says that integers >53 bits are automatically
            // serialized to strings. Since this field is user-provided, it
            // means that an irresponsible end-user could send large-enough
            // integers to hit this cap and thereby end up causing :fire: for
            // us.
            // Therefore, this defends against that exact issue.
            long start;
            try {
                start = data.getLong("start", -1L);
            } catch(final ClassCastException ignored) {
                start = Long.parseLong(data.getString("start", "-1"));
            }
            long end;
            try {
                end = data.getLong("end", -1L);
            } catch(final ClassCastException ignored) {
                end = Long.parseLong(data.getString("end", "-1"));
            }
            
            return ActivityTimestampsImpl.builder()
                    .start(start)
                    .end(end)
                    .build();
        }
    }
    
    @Nullable
    @CheckReturnValue
    public ActivityParty createParty(@Nullable final JsonObject data) {
        if(data == null) {
            return null;
        } else {
            final JsonArray size = data.getJsonArray("size", new JsonArray(Arrays.asList(-1, -1)));
            return ActivityPartyImpl.builder()
                    .id(data.getString("id"))
                    // Initialized to -1 if doesn't exist
                    .currentSize(size.getInteger(0))
                    .maxSize(size.getInteger(1))
                    .build();
        }
    }
    
    @Nullable
    @CheckReturnValue
    public ActivityAssets createAssets(@Nullable final JsonObject data) {
        if(data == null) {
            return null;
        } else {
            return ActivityAssetsImpl.builder()
                    .largeImage(data.getString("large_image"))
                    .largeText(data.getString("large_text"))
                    .smallImage(data.getString("small_image"))
                    .smallText(data.getString("small_text"))
                    .build();
        }
    }
    
    @Nullable
    @CheckReturnValue
    public ActivitySecrets createSecrets(@Nullable final JsonObject data) {
        if(data == null) {
            return null;
        } else {
            return ActivitySecretsImpl.builder()
                    .join(data.getString("join"))
                    .spectate(data.getString("spectate"))
                    .match(data.getString("match"))
                    .build();
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public TypingUser createTypingUser(@Nonnull final JsonObject data) {
        final String guildId = data.getString("guild_id");
        return TypingUserImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("user_id")))
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .timestamp(data.getLong("timestamp"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Member createMember(@Nonnull final String guildId, @Nonnull final String id, @Nonnull final JsonObject data) {
        final JsonObject userData = data.getJsonObject("user");
        final long guild = Long.parseUnsignedLong(guildId);
        if(userData != null) {
            catnip.cacheWorker().bulkCacheUsers(
                    (int)((guild >> 22) % catnip.shardManager().shardCount()),
                    Collections.singletonList(createUser(userData)));
        }
        final String joinedAt;
        if(data.getString("joined_at", null) != null) {
            joinedAt = data.getString("joined_at");
        } else {
            // This will only happen during GUILD_MEMBER_REMOVE afaik, but is this the right solution?
            final Member cachedMember = catnip.cache().member(guildId, id);
            if(cachedMember != null && cachedMember.joinedAt() != null) {
                // Guaranteed not null by preceding if
                //noinspection ConstantConditions
                joinedAt = cachedMember.joinedAt().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            } else {
                joinedAt = null;
            }
        }
        
        return MemberImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(id))
                .guildIdAsLong(guild)
                .nick(data.getString("nick"))
                .roleIds(toStringSet(data.getJsonArray("roles")))
                .joinedAt(joinedAt)
                // If not present, it's probably(?) safe to assume not
                .deaf(data.getBoolean("deaf", false))
                .mute(data.getBoolean("mute", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Member createMember(@Nonnull final String guildId, @SuppressWarnings("TypeMayBeWeakened") @Nonnull final User user,
                               @Nonnull final JsonObject data) {
        return createMember(guildId, user.id(), data);
    }
    
    @Nonnull
    @CheckReturnValue
    public Member createMember(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        return createMember(guildId, createUser(data.getJsonObject("user")), data);
    }
    
    @Nonnull
    @CheckReturnValue
    public PartialMember createPartialMember(@Nonnull final String guild, @Nonnull final JsonObject data) {
        return PartialMemberImpl.builder()
                .catnip(catnip)
                .guildIdAsLong(Long.parseUnsignedLong(guild))
                .user(createUser(data.getJsonObject("user")))
                .roleIds(toStringSet(data.getJsonArray("roles")))
                .nick(data.getString("nick"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public VoiceState createVoiceState(@Nullable final String guildId, @Nonnull final JsonObject data) {
        final String channelId = data.getString("channel_id");
        return VoiceStateImpl.builder()
                .catnip(catnip)
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .channelIdAsLong(channelId == null ? 0 : Long.parseUnsignedLong(channelId))
                .userIdAsLong(Long.parseUnsignedLong(data.getString("user_id")))
                .sessionId(data.getString("session_id"))
                .deaf(data.getBoolean("deaf"))
                .mute(data.getBoolean("mute"))
                .selfDeaf(data.getBoolean("self_deaf"))
                .selfMute(data.getBoolean("self_mute"))
                .suppress(data.getBoolean("suppress"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public VoiceState createVoiceState(@Nonnull final JsonObject data) {
        return createVoiceState(data.getString("guild_id"), data);
    }
    
    @Nonnull
    @CheckReturnValue
    public VoiceServerUpdate createVoiceServerUpdate(@Nonnull final JsonObject data) {
        return VoiceServerUpdateImpl.builder()
                .catnip(catnip)
                .token(data.getString("token"))
                .guildIdAsLong(Long.parseUnsignedLong(data.getString("guild_id")))
                .endpoint(data.getString("endpoint"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public UnicodeEmoji createUnicodeEmoji(@Nonnull final JsonObject data) {
        return UnicodeEmojiImpl.builder()
                .catnip(catnip)
                .name(data.getString("name"))
                .requiresColons(data.getBoolean("require_colons", true))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public CustomEmoji createCustomEmoji(@Nullable final String guildId, @Nonnull final JsonObject data) {
        final JsonObject userRaw = data.getJsonObject("user");
        
        return CustomEmojiImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .name(data.getString("name"))
                .roles(toStringList(data.getJsonArray("roles")))
                .user(userRaw == null ? null : createUser(userRaw))
                .requiresColons(data.getBoolean("require_colons", true))
                .managed(data.getBoolean("managed", false))
                .animated(data.getBoolean("animated", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Emoji createEmoji(@Nullable final String guildId, @Nonnull final JsonObject data) {
        // If it has an id, then it has a guild attached, so the @Nonnull warning can be ignored
        //noinspection ConstantConditions
        return data.getValue("id") == null ? createUnicodeEmoji(data) : createCustomEmoji(guildId, data);
    }
    
    @Nonnull
    @CheckReturnValue
    public EmojiUpdate createGuildEmojisUpdate(@Nonnull final JsonObject data) {
        final String guildId = data.getString("guild_id");
        return EmojiUpdateImpl.builder()
                .catnip(catnip)
                .guildIdAsLong(Long.parseUnsignedLong(guildId))
                .emojis(toList(data.getJsonArray("emojis"),
                        e -> createCustomEmoji(guildId, e)))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Attachment createAttachment(@Nonnull final JsonObject data) {
        return AttachmentImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .fileName(data.getString("filename"))
                .size(data.getInteger("size"))
                .url(data.getString("url"))
                .proxyUrl(data.getString("proxy_url"))
                .height(data.getInteger("height", -1))
                .width(data.getInteger("width", -1))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Reaction createReaction(@Nonnull final String guildId, @Nonnull final JsonObject data) {
        return ReactionImpl.builder()
                .count(data.getInteger("count"))
                .self(data.getBoolean("self", false))
                .emoji(createEmoji(guildId, data.getJsonObject("emoji")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public ReactionUpdate createReactionUpdate(@Nonnull final JsonObject data) {
        return ReactionUpdateImpl.builder()
                .catnip(catnip)
                .userId(data.getString("user_id"))
                .channelId(data.getString("channel_id"))
                .messageId(data.getString("message_id"))
                .guildId(data.getString("guild_id"))
                .emoji(createEmoji(null, data.getJsonObject("emoji")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public BulkRemovedReactions createBulkRemovedReactions(@Nonnull final JsonObject data) {
        return BulkRemovedReactionsImpl.builder()
                .catnip(catnip)
                .channelId(data.getString("channel_id"))
                .messageId(data.getString("message_id"))
                .guildId(data.getString("guild_id"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Message createMessage(@Nonnull final JsonObject data) {
        final User author = createUser(data.getJsonObject("author"));
        
        final JsonObject memberRaw = data.getJsonObject("member");
        // If member exists, guild_id must also exist
        final Member member = memberRaw == null ? null : createMember(data.getString("guild_id"), author, memberRaw);
        
        final String guildId = data.getString("guild_id");
        final String webhookId = data.getString("webhook_id");
        
        return MessageImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .author(author)
                .content(data.getString("content"))
                .timestamp(data.getString("timestamp"))
                .editedTimestamp(data.getString("edited_timestamp"))
                .tts(data.getBoolean("tts", false))
                .mentionsEveryone(data.getBoolean("mention_everyone", false))
                .mentionedUsers(toList(data.getJsonArray("mentions"), this::createUser))
                .mentionedRoles(toStringList(data.getJsonArray("mention_roles")))
                .attachments(toList(data.getJsonArray("attachments"), this::createAttachment))
                .embeds(toList(data.getJsonArray("embeds"), this::createEmbed))
                .reactions(toList(data.getJsonArray("reactions"), e -> createReaction(data.getString("guild_id"), e)))
                .nonce(String.valueOf(data.getValue("nonce")))
                .pinned(data.getBoolean("pinned", false))
                .type(MessageType.byId(data.getInteger("type", MessageType.DEFAULT.getId())))
                .member(member)
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .webhookIdAsLong(webhookId == null ? 0 : Long.parseUnsignedLong(webhookId))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public MessageEmbedUpdate createMessageEmbedUpdate(final JsonObject data) {
        final String guildId = data.getString("guild_id");
        return MessageEmbedUpdateImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .embeds(toList(data.getJsonArray("embeds"), this::createEmbed))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public GuildEmbed createGuildEmbed(@Nonnull final JsonObject data) {
        final String channelId = data.getString("channel_id");
        return GuildEmbedImpl.builder()
                .catnip(catnip)
                .channelIdAsLong(channelId == null ? 0 : Long.parseUnsignedLong(channelId))
                .enabled(data.getBoolean("enabled"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Guild createAndCacheGuild(@Nonnegative final int shardId, @Nonnull final JsonObject data) {
        // As we don't store these fields on the guild object itself, we have
        // to update them in the cache
        final String id = data.getString("id"); //optimization
        if(data.getJsonArray("roles") != null) {
            catnip.cacheWorker().bulkCacheRoles(shardId, toList(data.getJsonArray("roles"),
                    e -> createRole(id, e)));
        }
        if(data.getJsonArray("channels") != null) {
            catnip.cacheWorker().bulkCacheChannels(shardId, toList(data.getJsonArray("channels"),
                    e -> createGuildChannel(id, e)));
        }
        if(data.getJsonArray("members") != null) {
            catnip.cacheWorker().bulkCacheMembers(shardId, toList(data.getJsonArray("members"),
                    e -> createMember(id, e)));
        }
        if(data.getJsonArray("emojis") != null) {
            catnip.cacheWorker().bulkCacheEmoji(shardId, toList(data.getJsonArray("emojis"),
                    e -> createCustomEmoji(id, e)));
        }
        if(data.getJsonArray("presences") != null) {
            catnip.cacheWorker().bulkCachePresences(shardId, toMap(data.getJsonArray("presences"),
                    o -> o.getJsonObject("user").getString("id"), this::createPresence));
        }
        if(data.getJsonArray("voice_states") != null) {
            catnip.cacheWorker().bulkCacheVoiceStates(shardId, toList(
                    data.getJsonArray("voice_states"), e -> createVoiceState(id, e)));
        }
        return createGuild(data);
    }
    
    @Nonnull
    @CheckReturnValue
    public Guild createGuild(@Nonnull final JsonObject data) {
        final String afkChannelId = data.getString("afk_channel_id");
        final String embedChannelId = data.getString("embed_channel_id");
        final String applicationId = data.getString("application_id");
        final String widgetChannelId = data.getString("widget_channel_id");
        final String systemChannelId = data.getString("system_channel_id");
        return GuildImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .icon(data.getString("icon"))
                .splash(data.getString("splash"))
                .owned(data.getBoolean("owner", false))
                .ownerIdAsLong(Long.parseUnsignedLong(data.getString("owner_id")))
                .permissions(Permission.toSet(data.getLong("permissions", 0L)))
                .region(data.getString("region"))
                .afkChannelIdAsLong(afkChannelId == null ? 0 : Long.parseUnsignedLong(afkChannelId))
                .afkTimeout(data.getInteger("afk_timeout", 0))
                .embedEnabled(data.getBoolean("embed_enabled", false))
                .embedChannelIdAsLong(embedChannelId == null ? 0 : Long.parseUnsignedLong(embedChannelId))
                .verificationLevel(VerificationLevel.byKey(data.getInteger("verification_level", 0)))
                .defaultMessageNotifications(NotificationLevel.byKey(data.getInteger("default_message_notifications", 0)))
                .explicitContentFilter(ContentFilterLevel.byKey(data.getInteger("explicit_content_filter", 0)))
                .features(toStringList(data.getJsonArray("features")))
                .mfaLevel(MFALevel.byKey(data.getInteger("mfa_level", 0)))
                .applicationIdAsLong(applicationId == null ? 0 : Long.parseUnsignedLong(applicationId))
                .widgetEnabled(data.getBoolean("widget_enabled", false))
                .widgetChannelIdAsLong(widgetChannelId == null ? 0 : Long.parseUnsignedLong(widgetChannelId))
                .systemChannelIdAsLong(systemChannelId == null ? 0 : Long.parseUnsignedLong(systemChannelId))
                .joinedAt(data.getString("joined_at"))
                .large(data.getBoolean("large", false))
                .unavailable(data.getBoolean("unavailable", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public UnavailableGuild createUnavailableGuild(@Nonnull final JsonObject data) {
        return UnavailableGuildImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .unavailable(data.getBoolean("unavailable"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public PartialGuild createPartialGuild(@Nonnull final JsonObject data) {
        return PartialGuildImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .icon(data.getString("icon"))
                .owned(data.getBoolean("owner", false))
                .permissions(Permission.toSet(data.getLong("permissions", 0L)))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public GatewayGuildBan createGatewayGuildBan(@Nonnull final JsonObject data) {
        return GatewayGuildBanImpl.builder()
                .catnip(catnip)
                .guildIdAsLong(Long.parseUnsignedLong(data.getString("guild_id")))
                .user(createUser(data.getJsonObject("user")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public GuildBan createGuildBan(@Nonnull final JsonObject data) {
        return GuildBanImpl.builder()
                .catnip(catnip)
                .reason(data.getString("reason"))
                .user(createUser(data.getJsonObject("user")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Invite createInvite(@Nonnull final JsonObject data) {
        if(data.containsKey("uses")) {
            return createCreatedInvite(data);
        }
        return InviteImpl.builder()
                .catnip(catnip)
                .code(data.getString("code"))
                .inviter(createInviter(data.getJsonObject("inviter")))
                .guild(createInviteGuild(data.getJsonObject("guild")))
                .channel(createInviteChannel(data.getJsonObject("channel")))
                .approximatePresenceCount(data.getInteger("approximate_presence_count", -1))
                .approximateMemberCount(data.getInteger("approximate_member_count", -1))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public CreatedInvite createCreatedInvite(@Nonnull final JsonObject data) {
        return CreatedInviteImpl.builder()
                .catnip(catnip)
                .code(data.getString("code"))
                .inviter(createInviter(data.getJsonObject("inviter")))
                .guild(createInviteGuild(data.getJsonObject("guild")))
                .channel(createInviteChannel(data.getJsonObject("channel")))
                .approximatePresenceCount(data.getInteger("approximate_presence_count", -1))
                .approximateMemberCount(data.getInteger("approximate_member_count", -1))
                .uses(data.getInteger("uses"))
                .maxUses(data.getInteger("max_uses"))
                .maxAge(data.getInteger("max_age"))
                .temporary(data.getBoolean("temporary", false))
                .createdAt(data.getString("created_at"))
                .revoked(data.getBoolean("revoked", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public InviteChannel createInviteChannel(@Nonnull final JsonObject data) {
        return InviteChannelImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .type(ChannelType.byKey(data.getInteger("type")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public InviteGuild createInviteGuild(@Nonnull final JsonObject data) {
        return InviteGuildImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .icon(data.getString("icon"))
                .splash(data.getString("splash"))
                .features(toStringList(data.getJsonArray("features")))
                .verificationLevel(VerificationLevel.byKey(data.getInteger("verification_level", 0)))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Inviter createInviter(@Nonnull final JsonObject data) {
        return InviterImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .username(data.getString("username"))
                .discriminator(data.getString("discriminator"))
                .avatar(data.getString("avatar"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public VoiceRegion createVoiceRegion(@Nonnull final JsonObject data) {
        return VoiceRegionImpl.builder()
                .catnip(catnip)
                .id(data.getString("id"))
                .name(data.getString("name"))
                .vip(data.getBoolean("vip", false))
                .optimal(data.getBoolean("optimal", false))
                .deprecated(data.getBoolean("deprecated", false))
                .custom(data.getBoolean("custom", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Webhook createWebhook(@Nonnull final JsonObject data) {
        return WebhookImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .guildIdAsLong(Long.parseUnsignedLong(data.getString("guild_id")))
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .user(createUser(data.getJsonObject("user")))
                .name(data.getString("name"))
                .avatar(data.getString("avatar"))
                .token(data.getString("token"))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public WebhooksUpdate createWebhooksUpdate(@Nonnull final JsonObject data) {
        final String channelId = data.getString("channel_id");
        return WebhooksUpdateImpl.builder()
                .catnip(catnip)
                .guildIdAsLong(Long.parseUnsignedLong(data.getString("guild_id")))
                .channelIdAsLong(channelId == null ? 0 : Long.parseUnsignedLong(channelId))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public DeletedMessage createDeletedMessage(@Nonnull final JsonObject data) {
        final String guildId = data.getString("guild_id");
        return DeletedMessageImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public BulkDeletedMessages createBulkDeletedMessages(@Nonnull final JsonObject data) {
        final String guildId = data.getString("guild_id");
        return BulkDeletedMessagesImpl.builder()
                .catnip(catnip)
                .ids(toStringList(data.getJsonArray("ids")))
                .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                .guildIdAsLong(guildId == null ? 0 : Long.parseUnsignedLong(guildId))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Ready createReady(@Nonnull final JsonObject data) {
        return ReadyImpl.builder()
                .catnip(catnip)
                .version(data.getInteger("v"))
                .user(createUser(data.getJsonObject("user")))
                .trace(toStringList(data.getJsonArray("_trace")))
                .guilds(toSet(data.getJsonArray("guilds"), this::createUnavailableGuild))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public Resumed createResumed(@Nonnull final JsonObject data) {
        return ResumedImpl.builder()
                .catnip(catnip)
                .trace(toStringList(data.getJsonArray("_trace")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public AuditLogChange createAuditLogChange(@Nonnull final JsonObject data) {
        return AuditLogChangeImpl.builder()
                .catnip(catnip)
                .key(data.getString("key"))
                .newValue(data.getValue("new_value")) // no npe if null/optional key
                .oldValue(data.getValue("old_value"))
                .build();
    }
    
    @Nullable
    @CheckReturnValue
    public OptionalEntryInfo createOptionalEntryInfo(@Nonnull final JsonObject data, @Nonnull final ActionType type) {
        switch(type) {
            case MEMBER_PRUNE:
                return MemberPruneInfoImpl.builder()
                        .catnip(catnip)
                        .deleteMemberDays(data.getInteger("delete_member_days"))
                        .removedMembersCount(data.getInteger("members_removed"))
                        .build();
            case MESSAGE_DELETE:
                return MessageDeleteInfoImpl.builder()
                        .catnip(catnip)
                        .channelIdAsLong(Long.parseUnsignedLong(data.getString("channel_id")))
                        .deletedMessagesCount(Integer.parseUnsignedInt(data.getString("count")))
                        .build();
            case CHANNEL_OVERWRITE_CREATE:
            case CHANNEL_OVERWRITE_UPDATE:
            case CHANNEL_OVERWRITE_DELETE:
                return OverrideUpdateInfoImpl.builder()
                        .catnip(catnip)
                        .overriddenEntityIdAsLong(Long.parseUnsignedLong(data.getString("id")))
                        .overrideType(OverrideType.byKey(data.getString("type")))
                        .roleName(data.getString("role_name"))
                        .build();
            default:
                return null;
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public AuditLogEntry createAuditLogEntry(@Nonnull final JsonObject data, @Nonnull final Map<String, Webhook> webhooks,
                                             @Nonnull final Map<String, User> users) {
        final ActionType type = ActionType.byKey(data.getInteger("action_type"));
        final String targetId = data.getString("target_id");
        return AuditLogEntryImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .user(users.get(data.getString("user_id")))
                .targetIdAsLong(targetId == null ? 0 : Long.parseUnsignedLong(targetId))
                .webhook(webhooks.get(data.getString("target_id")))
                .type(type)
                .reason(data.getString("reason"))
                .changes(toList(data.getJsonArray("changes"), this::createAuditLogChange))
                .options(data.containsKey("options") ? createOptionalEntryInfo(data.getJsonObject("options"), type) : null)
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public List<AuditLogEntry> createAuditLog(@Nonnull final JsonObject data) {
        final Map<String, Webhook> webhooks = toMap(data.getJsonArray("webhooks"), x -> x.getString("id"), this::createWebhook);
        final Map<String, User> users = toMap(data.getJsonArray("users"), x -> x.getString("id"), this::createUser);
        
        return toList(data.getJsonArray("audit_log_entries"), e ->
                createAuditLogEntry(e, webhooks, users)
        );
    }
    
    @Nonnull
    @CheckReturnValue
    public ApplicationInfo createApplicationInfo(@Nonnull final JsonObject data) {
        return ApplicationInfoImpl.builder()
                .catnip(catnip)
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .name(data.getString("name"))
                .icon(data.getString("icon"))
                .description(data.getString("description"))
                .rpcOrigins(toStringList(data.getJsonArray("rpc_origins")))
                .publicBot(data.getBoolean("bot_public"))
                .requiresCodeGrant(data.getBoolean("bot_require_code_grant"))
                .owner(createApplicationOwner(data.getJsonObject("owner")))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public ApplicationOwner createApplicationOwner(@Nonnull final JsonObject data) {
        return ApplicationOwnerImpl.builder()
                .catnip(catnip)
                .username(data.getString("username"))
                .idAsLong(Long.parseUnsignedLong(data.getString("id")))
                .discriminator(data.getString("discriminator"))
                .avatar(data.getString("avatar", null))
                .bot(data.getBoolean("bot", false))
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    public GatewayInfo createGatewayInfo(@Nonnull final JsonObject data) {
        final JsonObject sessionStartLimit = data.getJsonObject("session_start_limit");
        if(data.containsKey("shards")) {
            // Valid data
            return GatewayInfoImpl.builder()
                    .catnip(catnip)
                    .valid(true)
                    .url(data.getString("url"))
                    .shards(data.getInteger("shards"))
                    .totalSessions(sessionStartLimit.getInteger("total"))
                    .remainingSessions(sessionStartLimit.getInteger("remaining"))
                    .resetAfter(sessionStartLimit.getLong("reset_after"))
                    .build();
        } else {
            // Invalid data - probably borked token
            return GatewayInfoImpl.builder()
                    .catnip(catnip)
                    .valid(false)
                    .url("")
                    .shards(0)
                    .totalSessions(0)
                    .remainingSessions(0)
                    .resetAfter(0)
                    .build();
        }
    }
}

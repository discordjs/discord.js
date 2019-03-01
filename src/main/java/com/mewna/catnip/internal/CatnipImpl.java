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

package com.mewna.catnip.internal;

import com.google.common.collect.ImmutableSet;
import com.mewna.catnip.Catnip;
import com.mewna.catnip.CatnipOptions;
import com.mewna.catnip.cache.CacheFlag;
import com.mewna.catnip.cache.EntityCacheWorker;
import com.mewna.catnip.entity.impl.*;
import com.mewna.catnip.entity.impl.PresenceImpl.ActivityImpl;
import com.mewna.catnip.entity.misc.GatewayInfo;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.entity.user.Presence.Activity;
import com.mewna.catnip.entity.user.Presence.ActivityType;
import com.mewna.catnip.entity.user.Presence.OnlineStatus;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.entity.util.Permission;
import com.mewna.catnip.extension.Extension;
import com.mewna.catnip.extension.manager.DefaultExtensionManager;
import com.mewna.catnip.extension.manager.ExtensionManager;
import com.mewna.catnip.rest.Rest;
import com.mewna.catnip.rest.requester.Requester;
import com.mewna.catnip.shard.*;
import com.mewna.catnip.shard.buffer.EventBuffer;
import com.mewna.catnip.shard.event.DispatchManager;
import com.mewna.catnip.shard.manager.ShardManager;
import com.mewna.catnip.shard.ratelimit.Ratelimiter;
import com.mewna.catnip.shard.session.SessionManager;
import com.mewna.catnip.util.JsonPojoCodec;
import com.mewna.catnip.util.PermissionUtil;
import com.mewna.catnip.util.SafeVertxCompletableFuture;
import com.mewna.catnip.util.logging.LogAdapter;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.JsonObject;
import lombok.Getter;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

import static com.mewna.catnip.shard.ShardAddress.*;

/**
 * @author amy
 * @since 8/31/18.
 */
@Getter
@SuppressWarnings("OverlyCoupledClass")
@Accessors(fluent = true, chain = true)
public class CatnipImpl implements Catnip {
    private final Vertx vertx;
    private final String token;
    private final boolean logExtensionOverrides;
    private final boolean validateToken;
    
    private final Rest rest = new Rest(this);
    private final ExtensionManager extensionManager = new DefaultExtensionManager(this);
    private final Set<String> unavailableGuilds = ConcurrentHashMap.newKeySet();
    private final AtomicReference<GatewayInfo> gatewayInfo = new AtomicReference<>(null);
    private long clientIdAsLong;
    
    private DispatchManager dispatchManager;
    private Requester requester;
    private ShardManager shardManager;
    private SessionManager sessionManager;
    private Ratelimiter gatewayRatelimiter;
    private LogAdapter logAdapter;
    private EventBuffer eventBuffer;
    private EntityCacheWorker cache;
    private Set<CacheFlag> cacheFlags;
    private boolean chunkMembers;
    private boolean emitEventObjects;
    private boolean enforcePermissions;
    private boolean captureRestStacktraces;
    private Presence initialPresence;
    private Set<String> disabledEvents;
    private CatnipOptions options;
    
    public CatnipImpl(@Nonnull final Vertx vertx, @Nonnull final CatnipOptions options) {
        this.vertx = vertx;
        applyOptions(options);
        token = options.token();
        logExtensionOverrides = options.logExtensionOverrides();
        validateToken = options.validateToken();
    }
    
    private void applyOptions(@Nonnull final CatnipOptions options) {
        // TODO: Should probably make this behave like #diff
        // so that we don't need to update this every single time that the
        // options change.
        this.options = options;
        dispatchManager = options.dispatchManager();
        requester = options.requester();
        shardManager = options.shardManager();
        sessionManager = options.sessionManager();
        gatewayRatelimiter = options.gatewayRatelimiter();
        logAdapter = options.logAdapter();
        eventBuffer = options.eventBuffer();
        cache = options.cacheWorker();
        cacheFlags = options.cacheFlags();
        chunkMembers = options.chunkMembers();
        emitEventObjects = options.emitEventObjects();
        enforcePermissions = options.enforcePermissions();
        captureRestStacktraces = options.captureRestStacktraces();
        initialPresence = options.presence();
        disabledEvents = ImmutableSet.copyOf(options.disabledEvents());
        
        injectSelf();
    }
    
    @Nonnull
    @Override
    public Catnip injectOptions(@Nonnull final Extension extension, @Nonnull final Function<CatnipOptions, CatnipOptions> optionsPatcher) {
        if(!extensionManager.matchingExtensions(extension.getClass()).isEmpty()) {
            final Map<String, Pair<Object, Object>> diff = diff(optionsPatcher.apply((CatnipOptions) options.clone()));
            if(!diff.isEmpty()) {
                if(logExtensionOverrides) {
                    diff.forEach((name, patch) -> logAdapter.info("Extension {} updated {} from \"{}\" to \"{}\".",
                            extension.name(), name, patch.getLeft(), patch.getRight()));
                }
                applyOptions(options);
            }
        } else {
            throw new IllegalArgumentException("Extension with class " + extension.getClass().getName()
                    + " isn't loaded, but tried to inject options!");
        }
        
        return this;
    }
    
    private Map<String, Pair<Object, Object>> diff(@Nonnull final CatnipOptions patch) {
        final Map<String, Pair<Object, Object>> diff = new LinkedHashMap<>();
        // Yeah this is ugly reflection bs, I know. But this allows it to
        // automatically diff it without having to know about what every
        // field is.
        for(final Field field : patch.getClass().getDeclaredFields()) {
            // Don't compare tokens because there's no point
            if(!field.getName().equals("token")) {
                try {
                    field.setAccessible(true);
                    final Object input = field.get(patch);
                    final Object original = field.get(options);
                    if(!Objects.equals(original, input)) {
                        diff.put(field.getName(), ImmutablePair.of(original, input));
                    }
                } catch(final IllegalAccessException e) {
                    logAdapter.error("Reflection did a \uD83D\uDCA9", e);
                }
            }
        }
        return diff;
    }
    
    @Nonnull
    @Override
    @CheckReturnValue
    public EventBus eventBus() {
        return vertx.eventBus();
    }
    
    @Nonnull
    @Override
    public Catnip loadExtension(@Nonnull final Extension extension) {
        extensionManager.loadExtension(extension);
        return this;
    }
    
    @Nullable
    @Override
    public User selfUser() {
        return cache().selfUser();
    }
    
    @Override
    public String clientId() {
        return Long.toUnsignedString(clientIdAsLong());
    }
    
    @Override
    public long clientIdAsLong() {
        return clientIdAsLong;
    }
    
    @Override
    public void shutdown(final boolean vertx) {
        shardManager.shutdown();
        if(vertx) {
            this.vertx.close();
        }
    }
    
    @Nonnull
    @Override
    public Set<String> unavailableGuilds() {
        return ImmutableSet.copyOf(unavailableGuilds);
    }
    
    public void markAvailable(final String id) {
        unavailableGuilds.remove(id);
    }
    
    public void markUnavailable(final String id) {
        unavailableGuilds.add(id);
    }
    
    @Override
    public boolean isUnavailable(@Nonnull final String guildId) {
        return unavailableGuilds.contains(guildId);
    }
    
    @Override
    public void openVoiceConnection(@Nonnull final String guildId, @Nonnull final String channelId) {
        PermissionUtil.checkPermissions(this, guildId, channelId, Permission.CONNECT);
        eventBus().send(computeAddress(VOICE_STATE_UPDATE_QUEUE, shardIdFor(guildId)),
                new JsonObject()
                        .put("guild_id", guildId)
                        .put("channel_id", channelId)
                        .put("self_mute", false)
                        .put("self_deaf", false));
    }
    
    @Override
    public void openVoiceConnection(final long guildId, final long channelId) {
        openVoiceConnection(String.valueOf(guildId), String.valueOf(channelId));
    }
    
    @Override
    public void closeVoiceConnection(@Nonnull final String guildId) {
        eventBus().send(computeAddress(VOICE_STATE_UPDATE_QUEUE, shardIdFor(guildId)),
                new JsonObject()
                        .put("guild_id", guildId)
                        .putNull("channel_id")
                        .put("self_mute", false)
                        .put("self_deaf", false));
    }
    
    @Override
    public void closeVoiceConnection(final long guildId) {
        closeVoiceConnection(String.valueOf(guildId));
    }
    
    @Override
    public void chunkMembers(@Nonnull final String guildId, @Nonnull final String query, @Nonnegative final int limit) {
        eventBus().send(computeAddress(WEBSOCKET_QUEUE, shardIdFor(guildId)),
                CatnipShard.basePayload(GatewayOp.REQUEST_GUILD_MEMBERS,
                        new JsonObject()
                                .put("guild_id", guildId)
                                .put("query", query)
                                .put("limit", limit)));
    }
    
    @Override
    public CompletionStage<Presence> presence(@Nonnegative final int shardId) {
        final Future<Presence> future = Future.future();
        eventBus().send(
                computeAddress(PRESENCE_UPDATE_REQUEST, shardId), null,
                result -> future.complete((Presence) result.result().body()));
        return SafeVertxCompletableFuture.from(this, future);
    }
    
    @Override
    public void presence(@Nonnull final Presence presence) {
        int shardCount = shardManager().shardCount();
        if(shardCount == 0) {
            shardCount = 1;
        }
        for(int i = 0; i < shardCount; i++) {
            presence(presence, i);
        }
    }
    
    @Override
    public void presence(@Nonnull final Presence presence, @Nonnegative final int shardId) {
        eventBus().publish(computeAddress(PRESENCE_UPDATE_REQUEST, shardId), presence);
    }
    
    @Override
    public void presence(@Nullable final OnlineStatus status, @Nullable final String game, @Nullable final ActivityType type,
                         @Nullable final String url) {
        final OnlineStatus stat;
        if(status != null) {
            stat = status;
        } else {
            final User self = selfUser();
            if(self != null) {
                final Presence presence = cache().presence(self.id());
                stat = presence == null ? OnlineStatus.ONLINE : presence.status();
            } else {
                stat = OnlineStatus.ONLINE;
            }
        }
        final Activity activity = game != null
                ? ActivityImpl.builder()
                .name(game)
                .type(type == null ? ActivityType.PLAYING : type)
                .url(type == ActivityType.STREAMING ? url : null)
                .build()
                : null;
        presence(PresenceImpl.builder()
                .catnip(this)
                .status(stat)
                .activity(activity)
                .build());
    }
    
    @Nonnull
    public CompletableFuture<Catnip> setup() {
        codecs();
        
        if(validateToken) {
            return fetchGatewayInfo()
                    .thenApply(gateway -> {
                        logAdapter.info("Token validated!");
                        
                        parseClientId();
                        
                        //this is actually needed because generics are dumb
                        return (Catnip) this;
                    }).exceptionally(e -> {
                        logAdapter.warn("Couldn't validate token!");
                        throw new RuntimeException(e);
                    })
                    .toCompletableFuture();
        } else {
            try {
                parseClientId();
            } catch(final IllegalArgumentException e) {
                final Exception wrapped = new RuntimeException("The provided token was invalid!", e);
                // I would use SafeVertxCompletableFuture.failedFuture but that was added in Java 9+
                // and catnip uses Java 8
                return SafeVertxCompletableFuture.from(this, Future.failedFuture(wrapped));
            }
            
            return SafeVertxCompletableFuture.completedFuture(this);
        }
    }
    
    private void injectSelf() {
        // Inject catnip instance into dependent fields
        dispatchManager.catnip(this);
        shardManager.catnip(this);
        eventBuffer.catnip(this);
        cache.catnip(this);
        requester.catnip(this);
    }
    
    private void codecs() {
        try {
            // Register codecs
            // God I hate having to do this
            // This is necessary to make Vert.x allow passing arbitrary objects
            // over the bus tho, since it doesn't obey typical Java serialization
            // stuff (for reasons I don't really get) and won't just dump stuff to
            // JSON when it doesn't have a codec
            // *sigh*
            // This is mainly important for distributed catnip; locally it'll just
            // not apply any transformations
            
            // Lifecycle
            codec(ReadyImpl.class);
            codec(ResumedImpl.class);
            
            // Messages
            codec(MessageImpl.class);
            codec(DeletedMessageImpl.class);
            codec(BulkDeletedMessagesImpl.class);
            codec(TypingUserImpl.class);
            codec(ReactionUpdateImpl.class);
            codec(BulkRemovedReactionsImpl.class);
            codec(MessageEmbedUpdateImpl.class);
            
            // Channels
            codec(CategoryImpl.class);
            codec(GroupDMChannelImpl.class);
            codec(TextChannelImpl.class);
            codec(UserDMChannelImpl.class);
            codec(VoiceChannelImpl.class);
            codec(WebhookImpl.class);
            codec(ChannelPinsUpdateImpl.class);
            codec(WebhooksUpdateImpl.class);
            
            // Guilds
            codec(GuildImpl.class);
            codec(GatewayGuildBanImpl.class);
            codec(EmojiUpdateImpl.class);
            codec(UnavailableGuildImpl.class);
            
            // Roles
            codec(RoleImpl.class);
            codec(PartialRoleImpl.class);
            codec(PermissionOverrideImpl.class);
            
            // Members
            codec(MemberImpl.class);
            codec(PartialMemberImpl.class);
            
            // Users
            codec(UserImpl.class);
            codec(PresenceImpl.class);
            codec(PresenceUpdateImpl.class);
            
            // Voice
            codec(VoiceStateImpl.class);
            codec(VoiceServerUpdateImpl.class);
            
            // Shards
            codec(ShardInfo.class);
            codec(ShardConnectState.class);
            codec(ShardControlMessage.class);
        } catch(final IllegalStateException e) {
            //only log once instead of one time per codec
            logAdapter.debug("Couldn't register codecs because they are already registered. " +
                    "This is probably because you're running multiple catnip instances on the same vert.x " +
                    "instance. If you're sure this is correct, you can ignore this warning.", e);
        }
    }
    
    private <T> void codec(@Nonnull final Class<T> cls) {
        eventBus().registerDefaultCodec(cls, new JsonPojoCodec<>(this, cls));
    }
    
    @Nonnull
    @Override
    public EntityCacheWorker cacheWorker() {
        return cache;
    }
    
    @Nonnull
    public Catnip connect() {
        shardManager.start();
        return this;
    }
    
    private int shardIdFor(@Nonnull final String guildId) {
        final long idLong = Long.parseUnsignedLong(guildId);
        return (int) ((idLong >>> 22) % shardManager.shardCount());
    }
    
    private void parseClientId() {
        // bot tokens are comprised of 3 parts, each encoded in base 64 and joined by periods.
        // the first part is the client id.
        final String clientIdBase64 = token.split("\\.")[0];
        final String clientId = new String(Base64.getDecoder().decode(clientIdBase64));
        clientIdAsLong = Long.parseUnsignedLong(clientId);
    }
    
    @Nullable
    @Override
    public GatewayInfo gatewayInfo() {
        return gatewayInfo.get();
    }
    
    @Nonnull
    @Override
    public CompletionStage<GatewayInfo> fetchGatewayInfo() {
        return rest.user().getGatewayBot()
                .thenApply(g -> {
                    if(g.valid()) {
                        gatewayInfo.set(g);
                        return g;
                    } else {
                        throw new RuntimeException("Gateway info not valid! Is your token valid?");
                    }
                });
    }
}

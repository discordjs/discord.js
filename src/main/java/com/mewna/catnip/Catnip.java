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

import com.mewna.catnip.cache.CacheFlag;
import com.mewna.catnip.cache.EntityCache;
import com.mewna.catnip.cache.EntityCacheWorker;
import com.mewna.catnip.entity.channel.Webhook;
import com.mewna.catnip.entity.misc.GatewayInfo;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.entity.user.Presence.ActivityType;
import com.mewna.catnip.entity.user.Presence.OnlineStatus;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.extension.Extension;
import com.mewna.catnip.extension.manager.ExtensionManager;
import com.mewna.catnip.internal.CatnipImpl;
import com.mewna.catnip.rest.Rest;
import com.mewna.catnip.shard.EventType;
import com.mewna.catnip.shard.buffer.EventBuffer;
import com.mewna.catnip.shard.event.DispatchManager;
import com.mewna.catnip.shard.manager.ShardManager;
import com.mewna.catnip.shard.ratelimit.Ratelimiter;
import com.mewna.catnip.shard.session.SessionManager;
import com.mewna.catnip.util.Utils;
import com.mewna.catnip.util.logging.LogAdapter;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.MessageConsumer;
import org.apache.commons.lang3.tuple.Pair;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * @author amy
 * @since 9/3/18.
 */
@SuppressWarnings({"unused", "OverlyCoupledClass"})
public interface Catnip {
    /**
     * Create a new catnip instance with the given token.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param token The token to be used for all API operations.
     *
     * @return A new catnip instance.
     */
    static Catnip catnip(@Nonnull final String token) {
        return catnipAsync(token).join();
    }
    
    /**
     * Create a new catnip instance with the given token.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param token The token to be used for all API operations.
     *
     * @return A new catnip instance.
     */
    static CompletableFuture<Catnip> catnipAsync(@Nonnull final String token) {
        return catnipAsync(token, Vertx.vertx());
    }
    
    /**
     * Create a new catnip instance with the given options.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param options The options to be applied to the catnip instance.
     *
     * @return A new catnip instance.
     */
    static Catnip catnip(@Nonnull final CatnipOptions options) {
        return catnipAsync(options).join();
    }
    
    /**
     * Create a new catnip instance with the given options.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param options The options to be applied to the catnip instance.
     *
     * @return A new catnip instance.
     */
    static CompletableFuture<Catnip> catnipAsync(@Nonnull final CatnipOptions options) {
        return catnipAsync(options, Vertx.vertx());
    }
    
    /**
     * Create a new catnip instance with the given token and vert.x instance.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param token The token to be used for all API operations.
     * @param vertx The vert.x instance used to run the bot.
     *
     * @return A new catnip instance.
     */
    static Catnip catnip(@Nonnull final String token, @Nonnull final Vertx vertx) {
        return catnipAsync(token, vertx).join();
    }
    
    /**
     * Create a new catnip instance with the given token and vert.x instance.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param token The token to be used for all API operations.
     * @param vertx The vert.x instance used to run the bot.
     *
     * @return A new catnip instance.
     */
    static CompletableFuture<Catnip> catnipAsync(@Nonnull final String token, @Nonnull final Vertx vertx) {
        return catnipAsync(new CatnipOptions(token), vertx);
    }
    
    /**
     * Create a new catnip instance with the given options and vert.x instance.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param options The options to be applied to the catnip instance.
     * @param vertx   The vert.x instance used to run the bot.
     *
     * @return A new catnip instance.
     */
    static Catnip catnip(@Nonnull final CatnipOptions options, @Nonnull final Vertx vertx) {
        return catnipAsync(options, vertx).join();
    }
    
    /**
     * Create a new catnip instance with the given options and vert.x instance.
     * <p>
     * <strong>This method may block while validating the provided token.</strong>
     *
     * @param options The options to be applied to the catnip instance.
     * @param vertx   The vert.x instance used to run the bot.
     *
     * @return A new catnip instance.
     */
    static CompletableFuture<Catnip> catnipAsync(@Nonnull final CatnipOptions options, @Nonnull final Vertx vertx) {
        return new CatnipImpl(vertx, options).setup();
    }
    
    /**
     * @return The cached gateway info. May be null if it hasn't been fetched
     * yet.
     */
    @Nullable
    @CheckReturnValue
    GatewayInfo gatewayInfo();
    
    /**
     * Fetches the gateway info and updates the cache. Calls made to {@link #gatewayInfo()}
     * after this stage completes successfully are guaranteed to return a non null value.
     * <p>
     * Updates the cached gateway info.
     *
     * @return The gateway info fetched from discord.
     */
    @Nonnull
    @CheckReturnValue
    CompletionStage<GatewayInfo> fetchGatewayInfo();
    
    /**
     * @return The vert.x instance being used by this catnip instance.
     */
    @Nonnull
    @CheckReturnValue
    Vertx vertx();
    
    // Implementations are lombok-generated
    
    /**
     * @return The event bus used by the vert.x instance that this catnip
     * instance uses.
     *
     * @see #vertx()
     */
    @Nonnull
    @CheckReturnValue
    EventBus eventBus();
    
    /**
     * Handles dispatching and listening to events.
     *
     * @return The current dispatch manager instance.
     */
    @Nonnull
    @CheckReturnValue
    DispatchManager dispatchManager();
    
    /**
     * Start all shards asynchronously. To customize the shard spawning /
     * management strategy, see {@link CatnipOptions}.
     *
     * @return Itself.
     */
    @Nonnull
    Catnip connect();
    
    /**
     * @return The token being used by this catnip instance.
     */
    @Nonnull
    String token();
    
    /**
     * @return The shard manager being used by this catnip instance.
     */
    @Nonnull
    ShardManager shardManager();
    
    /**
     * @return The session manager being used by this catnip instance.
     */
    @Nonnull
    SessionManager sessionManager();
    
    /**
     * @return The gateway message send ratelimiter being used by this catnip
     * instance.
     */
    @Nonnull
    Ratelimiter gatewayRatelimiter();
    
    /**
     * @return The REST API instance for this catnip instance.
     */
    @Nonnull
    @CheckReturnValue
    Rest rest();
    
    /**
     * The logging adapter. This is used throughout the lib to log things, and
     * may additionally be used by user code if you don't want to set up your
     * own logging things. The logging adapter is exposed like this because it
     * is possible to specify a custom logging adapter in
     * {@link CatnipOptions}; generally you should just stick with the provided
     * default SLF4J logging adapter.
     *
     * @return The logging adapter being used by this catnip instance.
     */
    @Nonnull
    LogAdapter logAdapter();
    
    /**
     * @return The event buffer being used by this catnip instance.
     */
    @Nonnull
    EventBuffer eventBuffer();
    
    /**
     * @return The entity cache being used by this catnip instance.
     */
    @Nonnull
    EntityCache cache();
    
    /**
     * The cache worker being used by this catnip instance. You should use this
     * if you need to do special caching for some reason.
     *
     * @return The cache worker being used by this catnip instance.
     */
    @Nonnull
    EntityCacheWorker cacheWorker();
    
    /**
     * The set of cache flags to be applied to the entity cache. These
     * currently allow for simply dropping data instead of caching it, but may
     * be expanded on in the future.
     *
     * @return The set of cache flags being used by this catnip instance.
     */
    @Nonnull
    Set<CacheFlag> cacheFlags();
    
    /**
     * @return Whether or not this catnip instance will chunk guild members
     * when it connects to the websocket gateway.
     */
    boolean chunkMembers();
    
    /**
     * @return Whether or not this catnip instance will emit event objects as
     * it receives events from the gateway. You should only disable this if you
     * want to do something special with the raw event objects via hooks.
     */
    boolean emitEventObjects();
    
    /**
     * @return Whether or not this catnip instance will execute permission
     * checks before doing a request. Does not affect direct calls to {@link #rest() Rest}
     * methods. If, for whatever reason, the needed entities for the permission
     * calculation cannot be retrieved from the cache, such as using a
     * {@link com.mewna.catnip.cache.NoopEntityCache noop cache} or attempting to
     * do the requests before the cache has been populated, the check will assume
     * all permissions are available.
     */
    @SuppressWarnings("BooleanMethodIsAlwaysInverted")
    boolean enforcePermissions();
    
    /**
     * @return Whether or not this catnip instance will capture stacktraces
     * before sending REST requests. This is useful for debugging.
     *
     * @see CatnipOptions#captureRestStacktraces
     */
    boolean captureRestStacktraces();
    
    /**
     * @return A set of all ids of unavailable guilds.
     */
    @Nonnull
    Set<String> unavailableGuilds();
    
    /**
     * @param guildId The guild to check.
     *
     * @return Whether or not the guild is unavailable.
     */
    boolean isUnavailable(@Nonnull final String guildId);
    
    /**
     * @return The extension manager being used by this catnip instance.
     */
    @Nonnull
    ExtensionManager extensionManager();
    
    /**
     * Load an extension for this catnip instance. See {@link Extension} for
     * more information.
     *
     * @param extension The extension to load.
     *
     * @return Itself.
     */
    @Nonnull
    Catnip loadExtension(@Nonnull Extension extension);
    
    /**
     * Inject options into this catnip instance from the given extension. This
     * allows extensions to do things like automatically register a new cache
     * worker without having to tell the end-user to specify options. By
     * default, options that get injected will be logged.
     *
     * @param extension      The extension injecting the options.
     * @param optionsPatcher Function responsible for updating the settings.
     *
     * @return Itself.
     *
     * @throws IllegalArgumentException When the given extension isn't loaded.
     */
    @Nonnull
    @SuppressWarnings("UnusedReturnValue")
    Catnip injectOptions(@Nonnull Extension extension, @Nonnull Function<CatnipOptions, CatnipOptions> optionsPatcher);
    
    /**
     * @return The currently-logged-in user. May be {@code null} if no shards
     * have logged in.
     */
    @Nullable
    User selfUser();
    
    /**
     * The ID of this client
     *
     * @return The ID of this client.
     */
    String clientId();
    
    /**
     * The ID of this client, as a long.
     *
     * @return The ID of the client, as a long.
     */
    long clientIdAsLong();
    
    /**
     * @return The initial presence to set when logging in via the gateway.
     * Will be null if not set via {@link CatnipOptions}.
     */
    @Nullable
    @CheckReturnValue
    Presence initialPresence();
    
    /**
     * @return The set of events that will not be fired. Empty by default.
     */
    @Nonnull
    @CheckReturnValue
    Set<String> disabledEvents();
    
    /**
     * Opens a voice connection to the provided guild and channel. The connection is
     * opened asynchronously, with
     * {@link com.mewna.catnip.shard.DiscordEvent#VOICE_STATE_UPDATE VOICE_STATE_UPDATE} and
     * {@link com.mewna.catnip.shard.DiscordEvent#VOICE_SERVER_UPDATE VOICE_SERVER_UPDATE}
     * events being fired when the connection is opened.
     *
     * @param guildId   Guild to connect.
     * @param channelId Channel to connect.
     */
    //TODO self mute/self deaf?
    void openVoiceConnection(@Nonnull String guildId, @Nonnull String channelId);
    
    /**
     * Opens a voice connection to the provided guild and channel. The connection is
     * opened asynchronously, with
     * {@link com.mewna.catnip.shard.DiscordEvent#VOICE_STATE_UPDATE VOICE_STATE_UPDATE} and
     * {@link com.mewna.catnip.shard.DiscordEvent#VOICE_SERVER_UPDATE VOICE_SERVER_UPDATE}
     * events being fired when the connection is opened.
     *
     * @param guildId   Guild to connect.
     * @param channelId Channel to connect.
     */
    //TODO self mute/self deaf?
    void openVoiceConnection(long guildId, long channelId);
    
    /**
     * Closes the voice connection on the specified guild.
     *
     * @param guildId Guild to disconnect.
     */
    void closeVoiceConnection(@Nonnull String guildId);
    
    /**
     * Closes the voice connection on the specified guild.
     *
     * @param guildId Guild to disconnect.
     */
    void closeVoiceConnection(long guildId);
    
    /**
     * Request all guild members for the given guild.
     *
     * @param guildId Guild to request for.
     */
    default void chunkMembers(final long guildId) {
        chunkMembers(Long.toString(guildId));
    }
    
    /**
     * Request all guild members for the given guild.
     *
     * @param guildId Guild to request for.
     */
    default void chunkMembers(@Nonnull final String guildId) {
        chunkMembers(guildId, "", 0);
    }
    
    /**
     * Request guild members for the given guild.
     *
     * @param guildId Guild to request for.
     * @param query   Member names must start with this.
     */
    default void chunkMembers(final long guildId, @Nonnull final String query) {
        chunkMembers(Long.toString(guildId), query);
    }
    
    /**
     * Request guild members for the given guild.
     *
     * @param guildId Guild to request for.
     * @param query   Member names must start with this.
     */
    default void chunkMembers(@Nonnull final String guildId, @Nonnull final String query) {
        chunkMembers(guildId, query, 0);
    }
    
    /**
     * Request guild members for the given guild.
     *
     * @param guildId Guild to request for.
     * @param limit   Maximum number of members to return. 0 for no limit.
     */
    default void chunkMembers(final long guildId, @Nonnegative final int limit) {
        chunkMembers(Long.toString(guildId), "", limit);
    }
    
    /**
     * Request guild members for the given guild.
     *
     * @param guildId Guild to request for.
     * @param limit   Maximum number of members to return. 0 for no limit.
     */
    default void chunkMembers(@Nonnull final String guildId, @Nonnegative final int limit) {
        chunkMembers(guildId, "", limit);
    }
    
    /**
     * Request guild members for the given guild.
     *
     * @param guildId Guild to request for.
     * @param query   Members returned must have a username starting with this.
     * @param limit   Maximum number of members to return. 0 for no limit.
     */
    default void chunkMembers(final long guildId, @Nonnull final String query, @Nonnegative final int limit) {
        chunkMembers(Long.toString(guildId), query, limit);
    }
    
    /**
     * Request guild members for the given guild.
     *
     * @param guildId Guild to request for.
     * @param query   Members returned must have a username starting with this.
     * @param limit   Maximum number of members to return. 0 for no limit.
     */
    void chunkMembers(@Nonnull String guildId, @Nonnull String query, @Nonnegative int limit);
    
    /**
     * Get the presence for the specified shard.
     *
     * @param shardId The shard id to get presence for.
     */
    CompletionStage<Presence> presence(@Nonnegative final int shardId);
    
    /**
     * Update the presence for all shards.
     *
     * @param presence The new presence to set.
     */
    void presence(@Nonnull final Presence presence);
    
    /**
     * Update the presence for a specific shard.
     *
     * @param presence The new presence to set.
     * @param shardId  The shard to set presence for.
     */
    void presence(@Nonnull final Presence presence, @Nonnegative final int shardId);
    
    /**
     * Update the presence for all shards by specifying each part of the
     * presence individually.
     *
     * @param status The new online status. Set to {@code null} for online.
     * @param game   The new game name. Set to {@code null} to clear.
     * @param type   The type of the new game status. Set to {@code null} for
     *               "playing."
     * @param url    The new URL for the presence. Will be ignored if {@code type}
     *               is not {@link ActivityType#STREAMING}.
     */
    void presence(@Nullable final OnlineStatus status, @Nullable final String game, @Nullable final ActivityType type,
                  @Nullable final String url);
    
    /**
     * Update the online status for all shards. Will clear the activity status.
     *
     * @param status The new online status to set.
     */
    default void status(@Nonnull final OnlineStatus status) {
        presence(status, null, null, null);
    }
    
    /**
     * Update the activity status for all shards. Will set the online status to
     * {@link OnlineStatus#ONLINE}
     *
     * @param game The new game to set.
     * @param type The type of the activity.
     * @param url  The URL if streaming. Will be ignored if {@code type} is not
     *             {@link ActivityType#STREAMING}.
     */
    default void game(@Nonnull final String game, @Nonnull final ActivityType type, @Nullable final String url) {
        presence(null, game, type, url);
    }
    
    /**
     * Add a consumer for the specified event type.
     *
     * @param type The type of event to listen on.
     * @param <T>  The object type of event being listened on.
     *
     * @return The vert.x message consumer.
     */
    default <T> MessageConsumer<T> on(@Nonnull final EventType<T> type) {
        return dispatchManager().createConsumer(type.key());
    }
    
    /**
     * Add a consumer for the specified event type with the given handler
     * callback.
     *
     * @param type    The type of event to listen on.
     * @param handler The handler for the event object.
     * @param <T>     The object type of event being listened on.
     *
     * @return The vert.x message consumer.
     */
    default <T> MessageConsumer<T> on(@Nonnull final EventType<T> type, @Nonnull final Consumer<T> handler) {
        return on(type).handler(m -> handler.accept(m.body()));
    }
    
    /**
     * Shutdown the catnip instance, undeploy all shards, and shutdown the
     * vert.x instance.
     */
    default void shutdown() {
        shutdown(true);
    }
    
    /**
     * Shutdown the catnip instance, undeploy all shards, and optionally
     * shutdown the vert.x instance.
     *
     * @param vertx Whether or not to shut down the vert.x instance.
     */
    void shutdown(boolean vertx);
    
    /**
     * Get a webhook object for the specified webhook URL. This method will
     * attempt to validate the webhook.
     *
     * @param webhookUrl The URL of the webhook.
     *
     * @return A stage that completes when the webhook is validated.
     */
    default CompletionStage<Webhook> parseWebhook(final String webhookUrl) {
        final Pair<String, String> parse = Utils.parseWebhook(webhookUrl);
        return parseWebhook(parse.getLeft(), parse.getRight());
    }
    
    /**
     * Get a webhook object for the specified webhook URL. This method will
     * attempt to validate the webhook.
     *
     * @param id    The webhook's id.
     * @param token The webhook's token.
     *
     * @return A stage that completes when the webhook is validated.
     */
    default CompletionStage<Webhook> parseWebhook(final String id, final String token) {
        return rest().webhook().getWebhookToken(id, token);
    }
}

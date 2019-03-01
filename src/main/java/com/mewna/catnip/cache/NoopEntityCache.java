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

package com.mewna.catnip.cache;

import com.mewna.catnip.Catnip;
import com.mewna.catnip.cache.view.CacheView;
import com.mewna.catnip.cache.view.NamedCacheView;
import com.mewna.catnip.entity.channel.GuildChannel;
import com.mewna.catnip.entity.channel.UserDMChannel;
import com.mewna.catnip.entity.guild.Guild;
import com.mewna.catnip.entity.guild.Member;
import com.mewna.catnip.entity.guild.Role;
import com.mewna.catnip.entity.misc.Emoji.CustomEmoji;
import com.mewna.catnip.entity.user.Presence;
import com.mewna.catnip.entity.user.User;
import com.mewna.catnip.entity.user.VoiceState;
import com.mewna.catnip.util.SafeVertxCompletableFuture;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;
import lombok.experimental.Accessors;

import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * @author amy
 * @since 9/13/18.
 */
@Accessors(fluent = true, chain = true)
@SuppressWarnings("unused")
public class NoopEntityCache implements EntityCacheWorker {
    @Nonnull
    @Override
    public Future<Void> updateCache(@Nonnull final String eventType, @Nonnegative final int shardId, @Nonnull final JsonObject payload) {
        return Future.succeededFuture();
    }
    
    @Override
    public void bulkCacheUsers(@Nonnegative final int shardId, @Nonnull final Collection<User> users) {
    }
    
    @Override
    public void bulkCacheChannels(@Nonnegative final int shardId, @Nonnull final Collection<GuildChannel> channels) {
    }
    
    @Override
    public void bulkCacheRoles(@Nonnegative final int shardId, @Nonnull final Collection<Role> roles) {
    }
    
    @Override
    public void bulkCacheMembers(@Nonnegative final int shardId, @Nonnull final Collection<Member> members) {
    }
    
    @Override
    public void bulkCacheEmoji(@Nonnegative final int shardId, @Nonnull final Collection<CustomEmoji> emoji) {
    }
    
    @Override
    public void bulkCachePresences(@Nonnegative final int shardId, @Nonnull final Map<String, Presence> presences) {
    }
    
    @Override
    public void bulkCacheVoiceStates(@Nonnegative final int shardId, @Nonnull final Collection<VoiceState> voiceStates) {
    }
    
    @Override
    public void invalidateShard(final int id) {
    
    }
    
    @Nullable
    @Override
    public Guild guild(@Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public Guild guild(final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<Guild> guildAsync(final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Guild> guilds() {
        return NamedCacheView.empty();
    }
    
    @Nullable
    @Override
    public User user(@Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public User user(final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<User> userAsync(final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nullable
    @Override
    public Presence presence(@Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public Presence presence(final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<Presence> presenceAsync(final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public CacheView<Presence> presences() {
        return CacheView.empty();
    }
    
    @Nullable
    @Override
    public Member member(@Nonnull final String guildId, @Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public Member member(final long guildId, final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<Member> memberAsync(final long guildId, final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Member> members(@Nonnull final String guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Member> members(final long guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Member> members() {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<User> users() {
        return NamedCacheView.empty();
    }
    
    @Nullable
    @Override
    public Role role(@Nonnull final String guildId, @Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public Role role(final long guildId, final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<Role> roleAsync(final long guildId, final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Role> roles(@Nonnull final String guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Role> roles(final long guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<Role> roles() {
        return NamedCacheView.empty();
    }
    
    @Nullable
    @Override
    public GuildChannel channel(@Nonnull final String guildId, @Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public GuildChannel channel(final long guildId, final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<GuildChannel> channelAsync(final long guildId, final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public NamedCacheView<GuildChannel> channels(@Nonnull final String guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<GuildChannel> channels(final long guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<GuildChannel> channels() {
        return NamedCacheView.empty();
    }
    
    @Nullable
    @Override
    public UserDMChannel dmChannel(@Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public UserDMChannel dmChannel(final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<UserDMChannel> dmChannelAsync(final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public CacheView<UserDMChannel> dmChannels() {
        return CacheView.empty();
    }
    
    @Nullable
    @Override
    public CustomEmoji emoji(@Nonnull final String guildId, @Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public CustomEmoji emoji(final long guildId, final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<CustomEmoji> emojiAsync(final long guildId, final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public NamedCacheView<CustomEmoji> emojis(@Nonnull final String guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<CustomEmoji> emojis(final long guildId) {
        return NamedCacheView.empty();
    }
    
    @Nonnull
    @Override
    public NamedCacheView<CustomEmoji> emojis() {
        return NamedCacheView.empty();
    }
    
    @Nullable
    @Override
    public VoiceState voiceState(@Nullable final String guildId, @Nonnull final String id) {
        return null;
    }
    
    @Nullable
    @Override
    public VoiceState voiceState(final long guildId, final long id) {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<VoiceState> voiceStateAsync(final long guildId, final long id) {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public CacheView<VoiceState> voiceStates(@Nonnull final String guildId) {
        return CacheView.empty();
    }
    
    @Nonnull
    @Override
    public CacheView<VoiceState> voiceStates(final long guildId) {
        return CacheView.empty();
    }
    
    @Nonnull
    @Override
    public CacheView<VoiceState> voiceStates() {
        return CacheView.empty();
    }
    
    @Nullable
    @Override
    public User selfUser() {
        return null;
    }
    
    @Nonnull
    @Override
    public CompletableFuture<User> selfUserAsync() {
        return SafeVertxCompletableFuture.completedFuture(null);
    }
    
    @Nonnull
    @Override
    public EntityCache catnip(@Nonnull final Catnip catnip) {
        return this;
    }
}

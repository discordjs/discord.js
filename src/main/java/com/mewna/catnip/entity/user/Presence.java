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

package com.mewna.catnip.entity.user;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mewna.catnip.entity.impl.PresenceImpl;
import com.mewna.catnip.entity.impl.PresenceImpl.ActivityImpl;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.EnumSet;
import java.util.Set;

/**
 * A user's presence. Online status, current game, ...
 *
 * @author amy
 * @since 9/21/18.
 */
@SuppressWarnings("unused")
@JsonDeserialize(as = PresenceImpl.class)
public interface Presence {
    @Nonnull
    @CheckReturnValue
    static Presence of(@Nonnull final OnlineStatus status, @Nullable final Activity activity) {
        return PresenceImpl.builder()
                .status(status)
                .activity(activity)
                .build();
    }
    
    @Nonnull
    @CheckReturnValue
    static Presence of(@Nonnull final OnlineStatus status) {
        return of(status, null);
    }
    
    @Nonnull
    OnlineStatus status();
    
    @SuppressWarnings("EmptyMethod")
    @Nullable
    OnlineStatus mobileStatus();
    
    @SuppressWarnings("EmptyMethod")
    @Nullable
    OnlineStatus webStatus();
    
    @SuppressWarnings("EmptyMethod")
    @Nullable
    OnlineStatus desktopStatus();
    
    @Nullable
    Activity activity();
    
    @Accessors(fluent = true, chain = true)
    enum OnlineStatus {
        ONLINE,
        IDLE,
        DND,
        OFFLINE,
        /**
         * Can only be sent; we should NEVER recv. this.
         */
        INVISIBLE,
        ;
        
        @Nonnull
        public static OnlineStatus fromString(@Nonnull final String status) {
            switch(status) {
                case "online": {
                    return ONLINE;
                }
                case "idle": {
                    return IDLE;
                }
                case "dnd": {
                    return DND;
                }
                case "offline": {
                    return OFFLINE;
                }
                case "invisible": {
                    return  INVISIBLE;
                }
                default: {
                    throw new IllegalArgumentException("Unknown status: " + status);
                }
            }
        }
        
        @Nonnull
        public String asString() {
            return name().toLowerCase();
        }
    }
    
    @Accessors(fluent = true, chain = true)
    @RequiredArgsConstructor
    enum ActivityType {
        PLAYING(0),
        STREAMING(1),
        LISTENING(2),
        WATCHING(3),
        ;
        @Getter
        private final int id;
        
        @Nonnull
        public static ActivityType byId(@Nonnegative final int id) {
            for(final ActivityType type : values()) {
                if(type.id == id) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown ActivityType: " + id);
        }
        
        @Nonnull
        public String asString() {
            return name().toLowerCase();
        }
    }
    
    @Accessors(fluent = true, chain = true)
    @RequiredArgsConstructor
    enum ActivityFlag {
        INSTANCE(1), // 1 << 0
        JOIN(1 << 1),
        SPECTATE(1 << 2),
        JOIN_REQUEST(1 << 3),
        SYNC(1 << 4),
        PLAY(1 << 5),
        ;
        
        private final int bits;
        
        @Nonnull
        public static Set<ActivityFlag> fromInt(final int flags) {
            final Set<ActivityFlag> set = EnumSet.noneOf(ActivityFlag.class);
            for(final ActivityFlag flag : values()) {
                if((flags & flag.bits) == flag.bits) {
                    set.add(flag);
                }
            }
            return set;
        }
    }
    
    interface ActivityTimestamps {
        long start();
        
        long end();
    }
    
    interface ActivityParty {
        @Nullable
        String id();
        
        int currentSize();
        
        int maxSize();
    }
    
    interface ActivityAssets {
        @Nullable
        String largeImage();
        
        @Nullable
        String largeText();
        
        @Nullable
        String smallImage();
        
        @Nullable
        String smallText();
    }
    
    interface ActivitySecrets {
        @Nullable
        String join();
        
        @Nullable
        String spectate();
        
        @Nullable
        String match();
    }
    
    @JsonDeserialize(as = ActivityImpl.class)
    interface Activity {
        @Nonnull
        @CheckReturnValue
        static Activity of(@Nonnull final String name, @Nonnull final ActivityType type, @Nullable final String url) {
            if(url == null && type == ActivityType.STREAMING) {
                throw new IllegalArgumentException("A valid twitch.tv URL must be specified when the ActivityType == STREAMING!");
            }
            if(url != null && type != ActivityType.STREAMING) {
                throw new IllegalArgumentException("You can only specify an URL when the ActivityType == STREAMING!");
            }
            return ActivityImpl.builder()
                    .name(name)
                    .type(type)
                    .url(url)
                    .build();
        }
        
        @Nonnull
        @CheckReturnValue
        static Activity of(@Nonnull final String name, @Nonnull final ActivityType type) {
            return of(name, type, null);
        }
        
        @Nonnull
        String name();
        
        @Nonnull
        ActivityType type();
        
        @Nullable
        String url();
        
        @Nullable
        ActivityTimestamps timestamps();
        
        @Nullable
        default String applicationId() {
            final long id = applicationIdAsLong();
            if(id == 0) {
                return null;
            }
            return Long.toUnsignedString(id);
        }
        
        long applicationIdAsLong();
        
        @Nullable
        String details();
        
        @Nullable
        String state();
        
        @Nullable
        ActivityParty party();
        
        @Nullable
        ActivityAssets assets();
        
        @Nullable
        ActivitySecrets secrets();
        
        boolean instance();
        
        @Nullable
        Set<ActivityFlag> flags();
    }
}

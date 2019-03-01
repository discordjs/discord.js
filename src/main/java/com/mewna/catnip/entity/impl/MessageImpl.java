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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mewna.catnip.Catnip;
import com.mewna.catnip.entity.RequiresCatnip;
import com.mewna.catnip.entity.Timestamped;
import com.mewna.catnip.entity.guild.Member;
import com.mewna.catnip.entity.message.Embed;
import com.mewna.catnip.entity.message.Message;
import com.mewna.catnip.entity.message.MessageType;
import com.mewna.catnip.entity.misc.Emoji;
import com.mewna.catnip.entity.user.User;
import lombok.*;
import lombok.experimental.Accessors;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * @author amy
 * @since 9/2/18.
 */
@Getter(onMethod_ = @JsonProperty)
@Setter(onMethod_ = @JsonProperty)
@Builder
@Accessors(fluent = true)
@NoArgsConstructor
@AllArgsConstructor
public class MessageImpl implements Message, RequiresCatnip, Timestamped {
    @JsonIgnore
    private transient Catnip catnip;
    
    private long idAsLong;
    private long channelIdAsLong;
    private User author;
    private String content;
    @JsonProperty
    private String timestamp;
    @JsonProperty
    private String editedTimestamp;
    private boolean tts;
    private boolean mentionsEveryone;
    private List<User> mentionedUsers;
    private List<String> mentionedRoles;
    @JsonProperty
    private List<Attachment> attachments;
    private List<Embed> embeds;
    @JsonProperty
    private List<Reaction> reactions;
    private String nonce;
    private boolean pinned;
    private long webhookIdAsLong;
    private MessageType type;
    private Member member;
    private long guildIdAsLong;
    
    @Override
    public void catnip(@Nonnull final Catnip catnip) {
        this.catnip = catnip;
        if(author instanceof RequiresCatnip) {
            ((RequiresCatnip) author).catnip(catnip);
        }
        for(User user: mentionedUsers) {
          if(user instanceof RequiresCatnip) {
              ((RequiresCatnip) user).catnip(catnip);
          }
        }
        if(member instanceof RequiresCatnip) {
            ((RequiresCatnip) member).catnip(catnip);
        }
    }
    
    @Nonnull
    @Override
    public OffsetDateTime timestamp() {
        return parseTimestamp(timestamp);
    }
    
    @Nullable
    @Override
    public OffsetDateTime editedTimestamp() {
        return parseTimestamp(editedTimestamp);
    }
    
    @Override
    @Nonnull
    @SuppressWarnings("unchecked")
    public List<Attachment> attachments() {
        return attachments;
    }
    
    @Override
    @Nonnull
    @SuppressWarnings("unchecked")
    public List<Reaction> reactions() {
        return reactions;
    }
    
    @Override
    public int hashCode() {
        return Long.hashCode(idAsLong);
    }
    
    @Override
    public boolean equals(final Object obj) {
        return obj instanceof Message && ((Message) obj).idAsLong() == idAsLong;
    }
    
    @Override
    public String toString() {
        return String.format("Message (%s)", content);
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentImpl implements Attachment, RequiresCatnip {
        private transient Catnip catnip;
        
        private long idAsLong;
        private String fileName;
        private int size;
        private String url;
        private String proxyUrl;
        private int height;
        private int width;
        
        @Override
        public void catnip(@Nonnull final Catnip catnip) {
            this.catnip = catnip;
        }
        
        @Override
        public int hashCode() {
            return Long.hashCode(idAsLong);
        }
        
        @Override
        public boolean equals(final Object obj) {
            return obj instanceof Attachment && ((Attachment) obj).idAsLong() == idAsLong;
        }
        
        @Override
        public String toString() {
            return String.format("Attachment (%s)", fileName);
        }
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReactionImpl implements Reaction {
        private int count;
        private boolean self;
        private Emoji emoji;
        
        @Override
        public int hashCode() {
            return emoji.hashCode();
        }
        
        @Override
        public boolean equals(final Object obj) {
            return obj instanceof Reaction && ((Reaction) obj).emoji().equals(emoji);
        }
        
        @Override
        public String toString() {
            return String.format("Reaction (%d x %s, self = %b)", count, emoji, self);
        }
    }
}

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

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mewna.catnip.entity.Timestamped;
import com.mewna.catnip.entity.message.Embed;
import lombok.*;
import lombok.experimental.Accessors;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * @author natanbc
 * @since 9/2/18.
 */
@Getter(onMethod_ = @JsonProperty)
@Setter(onMethod_ = @JsonProperty)
@Builder
@Accessors(fluent = true)
@SuppressWarnings("WeakerAccess")
@NoArgsConstructor
@AllArgsConstructor
public class EmbedImpl implements Embed, Timestamped {
    private String title;
    private EmbedType type;
    private String description;
    private String url;
    @JsonProperty
    private String timestamp;
    private Integer color;
    private Footer footer;
    private Image image;
    private Thumbnail thumbnail;
    private Video video;
    private Provider provider;
    private Author author;
    @JsonProperty
    private List<? extends Field> fields;
    
    @Override
    @Nonnull
    @SuppressWarnings("unchecked")
    public List<Field> fields() {
        return (List<Field>) fields;
    }
    
    @Nullable
    @Override
    public OffsetDateTime timestamp() {
        return parseTimestamp(timestamp);
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorImpl implements Author {
        private String name;
        private String url;
        private String iconUrl;
        private String proxyIconUrl;
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldImpl implements Field {
        private String name;
        private String value;
        private boolean inline;
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FooterImpl implements Footer {
        private String text;
        private String iconUrl;
        private String proxyIconUrl;
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageImpl implements Image {
        private String url;
        private String proxyUrl;
        private int height;
        private int width;
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProviderImpl implements Provider {
        private String name;
        private String url;
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThumbnailImpl implements Thumbnail {
        private String url;
        private String proxyUrl;
        private int height;
        private int width;
    }
    
    @Getter(onMethod_ = @JsonProperty)
    @Setter(onMethod_ = @JsonProperty)
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VideoImpl implements Video {
        private String url;
        private int height;
        private int width;
    }
}


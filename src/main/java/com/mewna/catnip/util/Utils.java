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

package com.mewna.catnip.util;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.function.LongPredicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SuppressWarnings("WeakerAccess")
public final class Utils {
    public static final List<String> VALID_CONTENT_TYPES = Collections.unmodifiableList(Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/gif"
    ));
    public static final long DISCORD_EPOCH = 1420070400000L;
    private static final Pattern WEBHOOK_PATTERN = Pattern.compile("https://discordapp\\.com/api/webhooks/(\\d+)/([\\w\\W]+)");
    
    private Utils() {
    }
    
    public static void removeIf(@Nonnull final Map<Long, ?> map, @Nonnull final LongPredicate predicate) {
        map.keySet().removeIf(predicate::test);
    }
    
    @Nonnull
    @CheckReturnValue
    public static OffsetDateTime creationTimeOf(final long id) {
        final long discordTimestamp = id >> 22;
        final Instant instant = Instant.ofEpochMilli(discordTimestamp + DISCORD_EPOCH);
        return instant.atOffset(ZoneOffset.UTC);
    }
    
    public static void validateImageUri(@Nonnull final URI imageUri) {
        if(!imageUri.getScheme().equals("data")) {
            throw new IllegalArgumentException("Only data URIs are supported");
        }
        final String data = imageUri.getSchemeSpecificPart();
        final int endContentType = data.indexOf(';');
        if(endContentType == -1) {
            throw new IllegalArgumentException("Malformed URI: unable to find end of content type");
        }
        final String contentType = data.substring(0, endContentType);
        if(!VALID_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Content type of " + contentType + " does not match " +
                    "expected values " + VALID_CONTENT_TYPES);
        }
        if(!data.startsWith("base64,", contentType.length() + 1)) {
            throw new IllegalArgumentException("Content not base64 encoded");
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public static URI asImageDataUri(@Nonnull final byte[] bytes) {
        final String contentType = probeContentType(bytes, "image/jpeg").toLowerCase();
        if(!VALID_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Content type of " + contentType + " does not match " +
                    "expected values " + VALID_CONTENT_TYPES);
        }
        return asImageDataUri(bytes, contentType);
    }
    
    @Nonnull
    @CheckReturnValue
    public static URI asImageDataUri(@Nonnull final byte[] bytes, @Nonnull final String forceContentType) {
        final String uri = "data:" + forceContentType + ";base64," + Base64.getEncoder().encodeToString(bytes);
        try {
            return new URI(uri);
        } catch(final URISyntaxException e) {
            throw new IllegalArgumentException("Unable to build URI", e);
        }
    }
    
    @Nonnull
    @CheckReturnValue
    public static String probeContentType(@Nonnull final byte[] bytes, @Nonnull final String defaultValue) {
        final String probed = probeContentType(bytes);
        if(probed == null) {
            return defaultValue;
        }
        return probed;
    }
    
    @Nullable
    @CheckReturnValue
    public static String probeContentType(@Nonnull final byte[] bytes) {
        try {
            return URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(bytes));
        } catch(final IOException e) {
            return null;
        }
    }
    
    @CheckReturnValue
    public static boolean containsIgnoreCase(@Nonnull final String str, @Nonnull final String search) {
        final int length = search.length();
        if(length == 0) {
            return true;
        }
        
        for(int i = str.length() - length; i >= 0; i--) {
            if(str.regionMatches(true, i, search, 0, length)) {
                return true;
            }
        }
        return false;
    }
    
    @CheckReturnValue
    public static boolean startsWithIgnoreCase(@Nonnull final String str, @Nonnull final String search) {
        final int length = search.length();
        if(length == 0 || length > str.length()) {
            return true;
        }
        return str.regionMatches(true, 0, search, 0, length);
    }
    
    @CheckReturnValue
    public static boolean endsWithIgnoreCase(@Nonnull final String str, @Nonnull final String search) {
        final int length = search.length();
        if(length == 0) {
            return true;
        }
        if(length > str.length()) {
            return false;
        }
        return str.regionMatches(true, str.length() - length, search, 0, length);
    }
    
    @CheckReturnValue
    public static Pair<String, String> parseWebhook(@Nonnull final String url) {
        final Matcher matcher = WEBHOOK_PATTERN.matcher(url);
        final String id = matcher.group(1);
        final String token = matcher.group(2);
        return ImmutablePair.of(id, token);
    }
    
    // Copied from JDA:
    // https://github.com/DV8FromTheWorld/JDA/blob/9e593c5d5e1abf0967998ac5fcc0d915495e0758/src/main/java/net/dv8tion/jda/core/utils/MiscUtil.java#L179-L198
    // Thank JDA devs! <3
    public static String encodeUTF8(final String chars) {
        try {
            return URLEncoder.encode(chars, "UTF-8");
        } catch(final UnsupportedEncodingException e) {
            throw new AssertionError(e); // thanks JDK 1.4
        }
    }
}

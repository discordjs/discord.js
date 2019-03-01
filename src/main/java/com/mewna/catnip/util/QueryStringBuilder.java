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

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnull;
import java.util.Collection;
import java.util.stream.Collectors;

/**
 * @author CircuitRCAY, natanbc
 *
 */
@SuppressWarnings("UnusedReturnValue")
public class QueryStringBuilder {
    private static final String UNSAFE_CHARS = " %$&+,/:;=?@<>#%";
    
    private final StringBuilder sb = new StringBuilder();
    private boolean hasQueryParams;
    
    @Nonnull
    public QueryStringBuilder append(@Nonnull final String text) {
        sb.append(text);
        return this;
    }
    
    @Nonnull
    public QueryStringBuilder append(@Nonnull final String key, @Nonnull final String value) {
        if(hasQueryParams) {
            sb.append('&').append(key).append('=').append(encode(value));
        } else {
            sb.append('?').append(key).append('=').append(encode(value));
            hasQueryParams = true;
        }
        return this;
    }
    
    @Nonnull
    public QueryStringBuilder append(@Nonnull final String key, @Nonnull final Collection<String> values) {
        return append(key, values.stream().map(QueryStringBuilder::encode).collect(Collectors.joining(",")));
    }
    
    @Nonnull
    @CheckReturnValue
    public String build() {
        return sb.toString();
    }
    
    // A useless function
    public QueryStringBuilder prepend(@Nonnull final String url) {
        sb.insert(0, url);
        return this;
    }
    
    private static String encode(@Nonnull final String input) {
        final StringBuilder resultStr = new StringBuilder();
        for (final char ch : input.toCharArray()) {
            if (isUnsafe(ch)) {
                resultStr.append('%');
                resultStr.append(toHex(ch / 16));
                resultStr.append(toHex(ch % 16));
            } else {
                resultStr.append(ch);
            }
        }
        return resultStr.toString();
    }
    
    private static char toHex(final int ch) {
        return (char) (ch < 10 ? '0' + ch : 'A' + ch - 10);
    }
    
    private static boolean isUnsafe(final char ch) {
        return ch > 128 || UNSAFE_CHARS.indexOf(ch) >= 0;
    }
}

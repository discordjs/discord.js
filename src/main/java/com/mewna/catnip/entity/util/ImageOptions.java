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

package com.mewna.catnip.entity.util;

import lombok.Getter;

import javax.annotation.CheckReturnValue;
import javax.annotation.Nonnegative;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * @author natanbc
 * @since 9/2/18.
 */
@Getter
public class ImageOptions {
    private ImageType type = ImageType.PNG;
    private int size = -1;
    
    private static boolean isPowerOfTwo(final int i) {
        final int minusOne = i - 1;
        return (i & minusOne) == 0;
    }
    
    @Nonnull
    @CheckReturnValue
    public ImageOptions type(@Nullable ImageType type) {
        if(type == null) {
            type = ImageType.PNG;
        }
        this.type = type;
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public ImageOptions gif() {
        return type(ImageType.GIF);
    }
    
    @Nonnull
    @CheckReturnValue
    public ImageOptions jpg() {
        return type(ImageType.JPG);
    }
    
    @Nonnull
    @CheckReturnValue
    public ImageOptions png() {
        return type(ImageType.PNG);
    }
    
    @Nonnull
    @CheckReturnValue
    public ImageOptions webp() {
        return type(ImageType.WEBP);
    }
    
    @Nonnull
    @CheckReturnValue
    public ImageOptions size(@Nonnegative final int size) {
        if(size < 16) {
            throw new IllegalArgumentException("Size must be greater than or equal to 16");
        }
        if(size > 2048) {
            throw new IllegalArgumentException("Size must be smaller than or equal to 2048");
        }
        if(!isPowerOfTwo(size)) {
            throw new IllegalArgumentException("Size must be a power of two");
        }
        this.size = size;
        return this;
    }
    
    @Nonnull
    @CheckReturnValue
    public String buildUrl(@Nonnull final String base) {
        return base + '.' + type.getFileExtension() + (size == -1 ? "" : "?size=" + size);
    }
}

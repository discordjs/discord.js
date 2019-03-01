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

package com.mewna.catnip.util.logging;

import org.slf4j.event.Level;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static org.slf4j.event.Level.*;

/**
 * If, for some reason, you want to plug in your own logging framework that
 * ISN'T logback, SLF4J, ..., then you can implement this interface. Check out
 * {@link DefaultLogAdapter} for an example.
 *
 * @author amy
 * @since 9/3/18.
 */
@SuppressWarnings("InterfaceMayBeAnnotatedFunctional")
public interface LogAdapter {
    void log(@Nonnull Level level, @Nonnull String message, @Nullable Object... objects);
    
    default void trace(@Nonnull final String message, @Nullable final Object... objects) {
        log(TRACE, message, objects);
    }
    
    default void debug(@Nonnull final String message, @Nullable final Object... objects) {
        log(DEBUG, message, objects);
    }
    
    default void info(@Nonnull final String message, @Nullable final Object... objects) {
        log(INFO, message, objects);
    }
    
    default void warn(@Nonnull final String message, @Nullable final Object... objects) {
        log(WARN, message, objects);
    }
    
    default void error(@Nonnull final String message, @Nullable final Object... objects) {
        log(ERROR, message, objects);
    }
}

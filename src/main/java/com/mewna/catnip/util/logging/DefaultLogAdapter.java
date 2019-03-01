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

import lombok.experimental.Accessors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;
import org.slf4j.helpers.FormattingTuple;
import org.slf4j.helpers.MessageFormatter;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * @author amy
 * @since 9/3/18.
 */
@Accessors(fluent = true)
public class DefaultLogAdapter implements LogAdapter {
    @SuppressWarnings("StaticVariableOfConcreteClass")
    private static final MySecurityManager mySecurityManager = new MySecurityManager();
    
    @Override
    public void log(@Nonnull final Level level, @Nonnull final String message, @Nullable final Object... objects) {
        // TODO: Switch this to use StackWalker when eventually moving to J9+
        final Class<?> caller = mySecurityManager.getCallerClassName(3);
        final Logger logger = LoggerFactory.getLogger(caller);
        final FormattingTuple tuple = MessageFormatter.arrayFormat(message, objects);
        final String formatted = tuple.getMessage();
        if(logger != null) {
            switch(level) {
                case TRACE: {
                    logger.trace(formatted);
                    if(tuple.getThrowable() != null) {
                        logger.trace("Stacktrace: ", tuple.getThrowable());
                    }
                    break;
                }
                case DEBUG: {
                    logger.debug(formatted);
                    if(tuple.getThrowable() != null) {
                        logger.debug("Stacktrace: ", tuple.getThrowable());
                    }
                    break;
                }
                case INFO: {
                    logger.info(formatted);
                    if(tuple.getThrowable() != null) {
                        logger.info("Stacktrace: ", tuple.getThrowable());
                    }
                    break;
                }
                case WARN: {
                    logger.warn(formatted);
                    if(tuple.getThrowable() != null) {
                        logger.warn("Stacktrace: ", tuple.getThrowable());
                    }
                    break;
                }
                case ERROR: {
                    logger.error(formatted);
                    if(tuple.getThrowable() != null) {
                        logger.error("Stacktrace: ", tuple.getThrowable());
                    }
                    break;
                }
            }
        }
    }
    
    /**
     * A custom security manager that exposes the getClassContext() information.
     * This is an ugly hack and needs to be replaced with the StackWalker API
     * when we eventually move to J9+. See this StackOverflow question:
     * https://stackoverflow.com/a/2924426/
     */
    static class MySecurityManager extends SecurityManager {
        Class<?> getCallerClassName(@SuppressWarnings("SameParameterValue") final int callStackDepth) {
            return getClassContext()[callStackDepth];
        }
    }
}

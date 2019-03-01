/*
 * Copyright (c) 2019 amy, All rights reserved.
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

package com.mewna.catnip.rest;

/**
 * @author SamOphis
 * @since 02/09/2019
 */
public class ResponseException extends RuntimeException {
    private final String route;
    private final int statusCode;
    private final String statusMessage;
    private final int jsonCode;
    private final String jsonMessage;
    
    public ResponseException(final String route, final int statusCode, final String statusMessage, final int jsonCode,
                             final String jsonMessage) {
        super(
                jsonCode == -1 ?
                        String.format("%s | HTTP Error Code: %d | JSON Message: %s", route, statusCode, jsonMessage) :
                        String.format("%s | HTTP Error Code: %d | JSON Message: %s | JSON Error Code: %d",
                                route, statusCode, jsonMessage, jsonCode)
        );
        this.route = route;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.jsonCode = jsonCode;
        this.jsonMessage = jsonMessage;
    }
    
    public String route() {
        return route;
    }
    
    public int statusCode() {
        return statusCode;
    }
    
    public String statusMessage() {
        return statusMessage;
    }
    
    public int jsonCode() {
        return jsonCode;
    }
    
    public String jsonMessage() {
        return jsonMessage;
    }
}

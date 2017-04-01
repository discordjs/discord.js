"use strict";

const Endpoints = require("./Endpoints");
const HTTPS = require("https");
const MultipartData = require("../util/MultipartData");
const SequentialBucket = require("../util/SequentialBucket");

/**
* Handles APi requests
*/
class RequestHandler {
    constructor(client, forceQueueing) {
        this._client = client;
        this.baseURL = Endpoints.BASE_URL;
        this.userAgent = `DiscordBot (https://github.com/abalabahaha/eris, ${require("../../package.json").version})`;
        this.ratelimits = {};
        this.latencyRef = {
            latency: 500,
            raw: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
            total: 5000,
            timeOffset: 0,
            lastTimeOffsetCheck: 0
        };
        this.globalBlock = false;
        this.readyQueue = [];
        if(forceQueueing) {
            this.globalBlock = true;
            this._client.once("shardPreReady", () => this.globalUnblock());
        }
    }

    globalUnblock() {
        this.globalBlock = false;
        while(this.readyQueue.length > 0) {
            this.readyQueue.shift()();
        }
    }

    routefy(url) {
        return url.replace(/\/([a-z-]+)\/(?:[0-9]{17,})+?/g, function(match, p) {
            return p === "channels" || p === "guilds" ? match : `/${p}/:id`;
        }).replace(/\/reactions\/.+/g, "/reactions/:id");
    }

    /**
    * Make an API request
    * @arg {String} method Uppercase HTTP method
    * @arg {String} url URL of the endpoint
    * @arg {Boolean} auth Whether to add the Authorization header and token or not
    * @arg {Object} [body] Request payload
    * @arg {Object} [file] File object
    * @arg {String} file.file A buffer containing file data
    * @arg {String} file.name What to name the file
    * @returns {Promise<Object>} Resolves with the returned JSON data
    */
    request(method, url, auth, body, file, _route, short) {
        var route = _route || this.routefy(url);

        return new Promise((resolve, reject) => {
            var attempts = 0;

            var actualCall = (cb) => {
                var headers = {
                    "User-Agent": this.userAgent
                };
                var data;

                try {
                    if(auth) {
                        headers.Authorization = this._client.token;
                    }
                    if(file && file.file) {
                        data = new MultipartData();
                        headers["Content-Type"] = "multipart/form-data; boundary=" + data.boundary;
                        data.attach("file", file.file, file.name);
                        if(body) {
                            data.attach("payload_json", body);
                        }
                        data = data.finish();
                    } else if(body) {
                        if(method === "GET" || (method === "PUT" && url.includes("/bans/"))) { // TODO remove PUT case when devs fix
                            var qs = "";
                            Object.keys(body).forEach(function(key) {
                                if(body[key] != undefined) {
                                     if(Array.isArray(body[key])) {
                                        body[key].forEach(function(val) {
                                            qs += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
                                        });
                                    } else {
                                        qs += `&${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`;
                                    }
                                }
                            });
                            url += "?" + qs.substring(1);
                        } else {
                            data = JSON.stringify(body);
                            headers["Content-Type"] = "application/json";
                        }
                    }
                } catch(err) {
                    cb();
                    reject(err);
                    return;
                }

                var req = HTTPS.request({
                    method: method,
                    host: "discordapp.com",
                    path: this.baseURL + url,
                    headers: headers
                });

                var reqError;

                req.once("abort", () => {
                    cb();
                    reqError = reqError || new Error(`Request aborted by client on ${method} ${url}`);
                    reqError.req = req;
                    reject(reqError);
                });

                req.once("aborted", () => {
                    cb();
                    reqError = reqError || new Error(`Request aborted by server on ${method} ${url}`);
                    reqError.req = req;
                    reject(reqError);
                });

                req.once("error", (err) => {
                    reqError = err;
                    req.abort();
                });

                var latency = Date.now();

                req.once("response", (resp) => {
                    latency = Date.now() - latency;
                    this.latencyRef.total = this.latencyRef.total - this.latencyRef.raw.shift() + latency;
                    this.latencyRef.latency = ~~(this.latencyRef.total / this.latencyRef.raw.push(latency));

                    var response = "";

                    resp.on("data", (chunk) => {
                        response += chunk;
                    });

                    resp.once("end", () => {
                        var now = Date.now();
                        if(this.latencyRef.lastTimeOffsetCheck < now - 60000) {
                            var timeOffset = Date.parse(resp.headers["date"]) - (this.latencyRef.lastTimeOffsetCheck = now);
                            if(~~(this.latencyRef.timeOffset) - this.latencyRef.latency >= 5000 && ~~(timeOffset) - this.latencyRef.latency >= 5000) {
                                this._client.emit("error", new Error(`Your clock is ${this.latencyRef.timeOffset}ms behind Discord's server clock. Please check your connection and system time.`));
                            }
                            this.latencyRef.timeOffset = timeOffset;
                        }

                        if(resp.headers["x-ratelimit-limit"]) {
                            this.ratelimits[route].limit = +resp.headers["x-ratelimit-limit"];
                        }

                        this.ratelimits[route].remaining = resp.headers["x-ratelimit-remaining"] === undefined ? 1 : +resp.headers["x-ratelimit-remaining"] || 0;

                        if(resp.headers["retry-after"]) {
                            if(resp.headers["x-ratelimit-global"]) {
                                this.globalBlock = true;
                                setTimeout(() => this.globalUnblock(), +resp.headers["retry-after"] || 1);
                            } else {
                                this.ratelimits[route].reset = (+resp.headers["retry-after"] || 1) + now;
                            }
                        } else if(resp.headers["x-ratelimit-reset"]) {
                            this.ratelimits[route].reset = Math.max(+resp.headers["x-ratelimit-reset"] * (route.endsWith("/reactions/:id") ? 250 : 1000) + this.latencyRef.timeOffset, now);
                        }

                        if(resp.statusCode !== 429) {
                            this._client.emit("debug", `${body && body.content} ${now} ${route} ${resp.statusCode}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${this.ratelimits[route].reset} (${this.ratelimits[route].reset - now}ms left)`);
                        }

                        if(resp.statusCode >= 300) {
                            if(resp.statusCode === 429) {
                                this._client.emit("warn", `${resp.headers["x-ratelimit-global"] ? "Global" : "Unexpected"} 429 (╯°□°）╯︵ ┻━┻: ${response}\n${body && body.content} ${now} ${route} ${resp.statusCode}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${this.ratelimits[route].reset} (${this.ratelimits[route].reset - now}ms left)`);
                                if(resp.headers["retry-after"]) {
                                    setTimeout(() => {
                                        this.request(method, url, auth, body, file, route, true).then(resolve).catch(reject);
                                        cb();
                                    }, +resp.headers["retry-after"]);
                                    return;
                                } else {
                                    this.request(method, url, auth, body, file, route, true).then(resolve).catch(reject);
                                    return cb();
                                }
                            } else if(resp.statusCode === 502 && ++attempts < 4) {
                                this._client.emit("warn", "A wild 502 appeared! Thanks CloudFlare!");
                                setTimeout(() => {
                                    this.request(method, url, auth, body, file, route, true).then(resolve).catch(reject);
                                }, Math.floor(Math.random() * 1900 + 100));
                                return cb();
                            }
                            var err = new Error(`${resp.statusCode} ${resp.statusMessage} on ${method} ${url}\n\n${response.substring(0, 200)}`);
                            err.resp = resp;
                            err.response = response;
                            err.req = req;
                            reject(err);
                            return cb();
                        }
                        if(response.length > 0) {
                            if(resp.headers["content-type"] === "application/json") {
                                try {
                                    response = JSON.parse(response);
                                } catch(err) {
                                    cb();
                                    reject(err);
                                    return;
                                }
                            }
                        }
                        cb();
                        resolve(response);
                    });
                });

                req.setTimeout(15000, function() {
                    reqError = new Error(`Request timed out (>15000ms) on ${method} ${url}`);
                    req.abort();
                });

                req.end(data);
            };

            if(this.globalBlock && auth) {
                this.readyQueue.push(() => {
                    if(!this.ratelimits[route]) {
                        this.ratelimits[route] = new SequentialBucket(1, this.latencyRef);
                    }
                    this.ratelimits[route].queue(actualCall, short);
                });
            } else {
                if(!this.ratelimits[route]) {
                    this.ratelimits[route] = new SequentialBucket(1, this.latencyRef);
                }
                this.ratelimits[route].queue(actualCall, short);
            }
        });
    }
}

module.exports = RequestHandler;

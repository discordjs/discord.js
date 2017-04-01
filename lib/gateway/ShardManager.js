"use strict";

const Collection = require("../util/Collection");
const Shard = require("./Shard");

class ShardManager extends Collection {
    constructor(client) {
        super(Shard);
        this.client = client;

        this.connectQueue = [];
        this.lastConnect = 0;
        this.connectTimeout = null;
    }

    _readyPacketCB() {
        this.lastConnect = Date.now();
        this.tryConnect();
    }

    connect(shard) {
        if(this.lastConnect <= Date.now() - 5000 && !this.find((shard) => shard.connecting)) {
            shard.connect();
            this.lastConnect = Date.now() + 7500;
        } else {
            this.connectQueue.push(shard);
            this.tryConnect();
        }
    }

    tryConnect() {
        if(this.connectQueue.length > 0) {
            if(this.lastConnect <= Date.now() - 5000) {
                var shard = this.connectQueue.shift();
                shard.connect();
                this.lastConnect = Date.now() + 7500;
            } else if(!this.connectTimeout) {
                this.connectTimeout = setTimeout(() => {
                    this.connectTimeout = null;
                    this.tryConnect();
                }, 1000);
            }
        }
    }

    spawn(id) {
        var shard = this.get(id);
        if(!shard) {
            shard = this.add(new Shard(id, this.client));
            shard.on("ready", () => {
                /**
                * Fired when a shard turns ready
                * @event Client#shardReady
                * @prop {Number} id The ID of the shard
                */
                this.client.emit("shardReady", shard.id);
                if(this.client.ready) {
                    return;
                }
                for(var other of this) {
                    if(!other[1].ready) {
                        return;
                    }
                }
                this.client.ready = true;
                this.client.startTime = Date.now();
                /**
                * Fired when all shards turn ready
                * @event Client#ready
                */
                this.client.emit("ready");
            }).on("resume", () => {
                /**
                * Fired when a shard resumes
                * @event Client#shardResume
                * @prop {Number} id The ID of the shard
                */
                this.client.emit("shardResume", shard.id);
                if(this.client.ready) {
                    return;
                }
                for(var other of this) {
                    if(!other[1].ready) {
                        return;
                    }
                }
                this.client.ready = true;
                this.client.startTime = Date.now();
                this.client.emit("ready");
            }).on("disconnect", (error) => {
                /**
                * Fired when a shard disconnects
                * @event Client#shardDisconnect
                * @prop {Error?} error The error, if any
                * @prop {Number} id The ID of the shard
                */
                this.client.emit("shardDisconnect", error, shard.id);
                if(!this.client.ready) {
                    return;
                }
                for(var other of this) {
                    if(other[1].ready) {
                        return;
                    }
                }
                this.client.ready = false;
                this.client.startTime = 0;
                /**
                * Fired when all shards disconnect
                * @event Client#disconnect
                */
                this.client.emit("disconnect");
            });
        }
        if(shard.status === "disconnected") {
            this.connect(shard);
        }
    }
}

module.exports = ShardManager;

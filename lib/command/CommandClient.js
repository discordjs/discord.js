"use strict";

const Client = require("../Client");
const Command = require("./Command");

/**
* Represents an Eris client with the command framework
* @extends Client
* @prop {Object} commands Object mapping command labels to Command objects
*/
class CommandClient extends Client {
    /**
    * Create a CommandClient
    * @arg {String} token bot token
    * @arg {Object} [options] Eris options (same as Client)
    * @arg {Object} [commandOptions] Command options
    * @arg {Boolean} [commandOptions.defaultHelpCommand=true] Whether to register the default help command or not
    * @arg {String} [commandOptions.description="An Eris-based Discord bot"] The description to show in the default help command
    * @arg {Boolean} [commandOptions.ignoreBots=true] Whether to ignore bot accounts or not
    * @arg {Boolean} [commandOptions.ignoreSelf=true] Whether to ignore the bot's own account or not
    * @arg {String} [commandOptions.name="<Bot username>"] The bot name to show in the default help command
    * @arg {String} [commandOptions.owner="an unknown user"] The owner to show in the default help command
    * @arg {String|Array} [commandOptions.prefix="@mention "] The bot prefix. Can be either an array of prefixes or a single prefix. "@mention" will be automatically replaced with the bot's actual mention
    * @arg {Object} [commandOptions.defaultCommandOptions={}] Default command options. This object takes the same options as a normal Command
    */
    constructor(token, options, commandOptions) {
        super(token, options);
        this.commandOptions = {
            defaultHelpCommand: true,
            description: "An Eris-based Discord bot",
            ignoreBots: true,
            ignoreSelf: true,
            name: null,
            owner: "an unknown user",
            prefix: "@mention ",
            defaultCommandOptions: {}
        };
        if(typeof commandOptions === "object") {
            for(var property of Object.keys(commandOptions)) {
                this.commandOptions[property] = commandOptions[property];
            }
        }
        this.guildPrefixes = {};
        this.commands = {};
        this.commandAliases = {};

        this.once("shardPreReady", () => {
            this.preReady = true;
            if(!this.commandOptions.name) {
                this.commandOptions.name = `**${this.user.username}**`;
            }
            if(Array.isArray(this.commandOptions.prefix)){
                for(let i in this.commandOptions.prefix){
                    this.commandOptions.prefix[i] = this.commandOptions.prefix[i].replace(/@mention/g, this.user.mention);
                }
            } else {
                this.commandOptions.prefix = this.commandOptions.prefix.replace(/@mention/g, this.user.mention);
            }
            for(var key in this.guildPrefixes) {
                if(Array.isArray(this.guildPrefixes[key])){
                    for(let i in this.guildPrefixes[key]){
                        this.guildPrefixes[key][i] = this.guildPrefixes[key][i].replace(/@mention/g, this.user.mention);
                    }
                } else {
                    this.guildPrefixes[key] = this.guildPrefixes[key].replace(/@mention/g, this.user.mention);
                }
            }
        });

        this.on("messageCreate", this.onMessageCreate);

        if(this.commandOptions.defaultHelpCommand) {
            this.registerCommand("help", (msg, args) => {
                var result = "";
                if(args.length > 0) {
                    var cur = this.commands[this.commandAliases[args[0]] || args[0]];
                    if(!cur) {
                        return "Command not found";
                    }
                    var label = cur.label;
                    for(var i = 1; i < args.length; ++i) {
                        cur = cur.subcommands[cur.subcommandAliases[args[i]] || args[i]];
                        if(!cur) {
                            return "Command not found";
                        }
                        label += " " + cur.label;
                    }
                    result += `**${msg.prefix}${label}** ${cur.usage}\n${cur.fullDescription}`;
                    if(Object.keys(cur.aliases).length > 0) {
                        result += `\n\n**Aliases:** ${cur.aliases.join(", ")}`;
                    }
                    if(Object.keys(cur.subcommands).length > 0) {
                        result += "\n\n**Subcommands:**";
                        for(var subLabel in cur.subcommands) {
                            if(cur.subcommands[subLabel].permissionCheck(msg)) {
                                result += `\n  **${subLabel}** - ${cur.subcommands[subLabel].description}`;
                            }
                        }
                    }
                } else {
                    result += `${this.commandOptions.name} - ${this.commandOptions.description}\n`;
                    if(this.commandOptions.owner) {
                        result += `by ${this.commandOptions.owner}\n`;
                    }
                    result += "\n";
                    result += "**Commands:**\n";
                    for(label in this.commands) {
                        if(this.commands[label] && this.commands[label].permissionCheck(msg)) {
                            result += `  **${msg.prefix}${label}** - ${this.commands[label].description}\n`;
                        }
                    }
                    result += `\nType ${msg.prefix}help <command> for more info on a command.`;
                }
                return result;
            }, {
                description: "This help text",
                fullDescription: "This command is used to view information of different bot commands, including this one."
            });
        }
    }

    /**
     * Checks the command client for a command based on the provided message
     * @arg {Message} msg The message object from the message create event
     */
    onMessageCreate(msg) {
        if(!this.ready) {
            return;
        }

        msg.command = false;
        if((!this.commandOptions.ignoreSelf || msg.author.id !== this.user.id) && (!this.commandOptions.ignoreBots || !msg.author.bot) && (msg.prefix = this.checkPrefix(msg))) {
            var args = msg.content.replace(/<@!/g, "<@").substring(msg.prefix.length).split(" ");
            var label = args.shift();
            label = this.commandAliases[label] || label;
            var command;
            if((command = this.commands[label]) !== undefined || ((command = this.commands[label.toLowerCase()]) !== undefined && command.caseInsensitive)) {
                msg.command = command;
                Promise.resolve(command.process(args, msg)).then((resp) => {
                    if(resp != null) {
                        this.createMessage(msg.channel.id, resp);
                    }
                }).catch((err) => {
                    this.emit("warn", err);
                    if(command.errorMessage) {
                        this.createMessage(msg.channel.id, command.errorMessage);
                    }
                });
            }
        }
    }

    /**
    * Register a prefix override for a specific guild
    * @arg {String} guildID The ID of the guild to override prefixes for
    * @arg {String|Array} prefix The bot prefix. Can be either an array of prefixes or a single prefix. "@mention" will be automatically replaced with the bot's actual mention
    */
    registerGuildPrefix(guildID, prefix) {
        if(this.preReady){
            this.guildPrefixes[guildID] = prefix;
        } else {
            if(Array.isArray(prefix)){
                for(var i in prefix){
                    prefix[i] = prefix[i].replace(/@mention/g, this.user.mention);
                }
                this.guildPrefixes[guildID] = prefix;
            } else {
                this.guildPrefixes[guildID] = prefix.replace(/@mention/g, this.user.mention);
            }
        }
    }

    checkPrefix(msg) {
        var prefixes = this.commandOptions.prefix;
        if(msg.channel.guild !== undefined && this.guildPrefixes[msg.channel.guild.id] !== undefined){
            prefixes = this.guildPrefixes[msg.channel.guild.id];
        }
        if(typeof prefixes === "string") {
            return msg.content.replace(/<@!/g, "<@").startsWith(prefixes) && prefixes;
        } else if(Array.isArray(prefixes)) {
            return prefixes.find((prefix) => msg.content.replace(/<@!/g, "<@").startsWith(prefix));
        }
        throw new Error("Unsupported prefix format | " + prefixes);
    }

    /**
    * Register an alias for a command
    * @arg {String} alias The alias
    * @arg {String} label The original command label
    */
    registerCommandAlias(alias, label) {
        var caseInsensitiveLabel = false;
        if(!this.commands[label] && !(this.commands[(label = label.toLowerCase())] && (caseInsensitiveLabel = this.commands[label.toLowerCase()].caseInsensitive))) {
            throw new Error("No command registered for " + label);
        }
        alias = caseInsensitiveLabel === true ? alias.toLowerCase() : alias;
        if(this.commandAliases[alias]) {
            throw new Error(`Alias ${alias} already registered`);
        }
        this.commandAliases[alias] = label;
        this.commands[label].aliases.push(alias);
    }

    /**
    * Register a command
    * @arg {String} label The command label
    * @arg {Function | String | Array<Function | String>} generator A response string, array of functions or strings, or function that generates a string or array of strings when called.
    * If a function is passed, the function will be passed a Message object and an array of command arguments. The Message object will have an additional property `prefix`, which is the prefix used in the command.
    * `generator(msg, args)`
    * @arg {Object} [options] Command options
    * @arg {Array<String>} [options.aliases] An array of command aliases
    * @arg {Boolean} [options.caseInsensitive=false] Whether the command label (and aliases) is case insensitive or not
    * @arg {Boolean} [options.deleteCommand=false] Whether to delete the user command message or not
    * @arg {Boolean} [options.argsRequired=false] If arguments are required or not
    * @arg {Boolean} [options.guildOnly=false] Whether to prevent the command from being used in Direct Messages or not
    * @arg {Boolean} [options.dmOnly=false] Whether to prevent the command from being used in guilds or not
    * @arg {String} [options.description="No description"] A short description of the command to show in the default help command
    * @arg {String} [options.fullDescription="No full description"] A detailed description of the command to show in the default help command
    * @arg {String} [options.usage] Details on how to call the command to show in the default help command
    * @arg {Object} [options.requirements] A set of factors that limit who can call the command
    * @arg {Array<String>} [options.requirements.userIDs] An array of user IDs representing users that can call the command
    * @arg {Object} [options.requirements.permissions] An object containing permission keys the user must match to use the command
    * i.e.:
    * ```
    * {
    *   "administrator": false,
    *   "manageMessages": true
    * }```
    * In the above example, the user must not have administrator permissions, but must have manageMessages to use the command
    * @arg {Array<String>} [options.requirements.roleIDs] An array of role IDs that would allow a user to use the command
    * @arg {Array<String>} [options.requirements.roleNames] An array of role names that would allow a user to use the command
    * @arg {Number} [options.cooldown] The cooldown between command usage in milliseconds
    * @arg {String} [options.cooldownMessage] A message to show when the command is on cooldown
    * @arg {String} [options.permissionMessage] A message to show when the user doesn't have permissions to use the command
    * @arg {String} [options.errorMessage] A message to show if the execution of the command handler somehow fails.
    * @returns {Command}
    */
    registerCommand(label, generator, options) {
        if(label.includes(" ")) {
            throw new Error("Command label may not have spaces");
        }
        if(this.commands[label]) {
            throw new Error("You have already registered a command for " + label);
        }
        options = options || {};
        label = options.caseInsensitive === true ? label.toLowerCase() : label;
        for(var key in this.commandOptions.defaultCommandOptions) {
            if(options[key] === undefined) {
                options[key] = this.commandOptions.defaultCommandOptions[key];
            }
        }
        this.commands[label] = new Command(label, generator, options);
        if(options.aliases) {
            options.aliases.forEach((alias) => {
                this.commandAliases[alias] = label;
            });
        }
        return this.commands[label];
    }

    /**
    * Unregister a command
    * @arg {String} label The command label
    */
    unregisterCommand(label) {
        var original = this.commandAliases[label];
        if(original) {
            this.commands[original].aliases.splice(this.commands[original].aliases.indexOf(label), 1);
            delete this.commandAliases[label];
        } else {
            delete this.commands[label];
        }
    }
}

module.exports = CommandClient;

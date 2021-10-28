"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _1 = require(".");
var client = new _1.Client({
    intents: _1.Intents.FLAGS.GUILDS,
    makeCache: _1.Options.cacheWithLimits({
        MessageManager: 200,
        // @ts-expect-error
        Message: 100,
        ThreadManager: {
            maxSize: 1000,
            keepOverLimit: function (x) { return x.id === '123'; },
            sweepInterval: 5000,
            sweepFilter: _1.LimitedCollection.filterByLifetime({
                getComparisonTimestamp: function (x) { var _a; return (_a = x.archiveTimestamp) !== null && _a !== void 0 ? _a : 0; },
                excludeFromSweep: function (x) { return !x.archived; }
            })
        }
    })
});
var testGuildId = '222078108977594368'; // DJS
var testUserId = '987654321098765432'; // example id
var globalCommandId = '123456789012345678'; // example id
var guildCommandId = '234567890123456789'; // example id
client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, globalCommand, guildCommandFromGlobal, guildCommandFromGuild, globalPermissionsManager, guildPermissionsManager, originalPermissions;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                console.log("Client is logged in as " + client.user.tag + " and ready!");
                // Test fetching all global commands and ones from one guild
                _a = assertType;
                return [4 /*yield*/, client.application.commands.fetch()];
            case 1:
                // Test fetching all global commands and ones from one guild
                _a.apply(void 0, [_m.sent()]);
                _b = assertType;
                return [4 /*yield*/, client.application.commands.fetch({ guildId: testGuildId })];
            case 2:
                _b.apply(void 0, [_m.sent()]);
                return [4 /*yield*/, ((_c = client.application) === null || _c === void 0 ? void 0 : _c.commands.fetch(globalCommandId))];
            case 3:
                globalCommand = _m.sent();
                return [4 /*yield*/, ((_d = client.application) === null || _d === void 0 ? void 0 : _d.commands.fetch(guildCommandId, { guildId: testGuildId }))];
            case 4:
                guildCommandFromGlobal = _m.sent();
                return [4 /*yield*/, ((_e = client.guilds.cache.get(testGuildId)) === null || _e === void 0 ? void 0 : _e.commands.fetch(guildCommandId))];
            case 5:
                guildCommandFromGuild = _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, ((_f = client.guilds.cache.get(testGuildId)) === null || _f === void 0 ? void 0 : _f.commands.fetch(guildCommandId, { guildId: testGuildId }))];
            case 6:
                // @ts-expect-error
                _m.sent();
                globalPermissionsManager = (_g = client.application) === null || _g === void 0 ? void 0 : _g.commands.permissions;
                guildPermissionsManager = (_h = client.guilds.cache.get(testGuildId)) === null || _h === void 0 ? void 0 : _h.commands.permissions;
                return [4 /*yield*/, ((_j = client.application) === null || _j === void 0 ? void 0 : _j.commands.permissions.fetch({ guild: testGuildId }))];
            case 7:
                originalPermissions = _m.sent();
                // Permissions from global manager
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.add({
                        command: globalCommandId,
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 8:
                // Permissions from global manager
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId }))];
            case 9:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.fetch({ guild: testGuildId }))];
            case 10:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.fetch({ command: globalCommandId, guild: testGuildId }))];
            case 11:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] }))];
            case 12:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] }))];
            case 13:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({
                        command: globalCommandId,
                        guild: testGuildId,
                        roles: [testGuildId],
                        users: [testUserId]
                    }))];
            case 14:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.set({
                        command: globalCommandId,
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 15:
                _m.sent();
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.set({
                        guild: testGuildId,
                        fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }]
                    }))];
            case 16:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.add({
                        command: globalCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 17:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.has({ command: globalCommandId, permissionId: testGuildId }))];
            case 18:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.fetch())];
            case 19:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.fetch({ command: globalCommandId }))];
            case 20:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ command: globalCommandId, roles: [testGuildId] }))];
            case 21:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ command: globalCommandId, users: [testUserId] }))];
            case 22:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] }))];
            case 23:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.set({
                        command: globalCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 24:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.set({
                        fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }]
                    }))];
            case 25:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.set({
                        command: globalCommandId,
                        guild: testGuildId,
                        fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }]
                    }))];
            case 26:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.add({
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 27:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.has({ guild: testGuildId, permissionId: testGuildId }))];
            case 28:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ guild: testGuildId, roles: [testGuildId] }))];
            case 29:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ guild: testGuildId, users: [testUserId] }))];
            case 30:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] }))];
            case 31:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalPermissionsManager === null || globalPermissionsManager === void 0 ? void 0 : globalPermissionsManager.set({
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 32:
                // @ts-expect-error
                _m.sent();
                // Permissions from guild manager
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.add({
                        command: globalCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 33:
                // Permissions from guild manager
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.has({ command: globalCommandId, permissionId: testGuildId }))];
            case 34:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.fetch({}))];
            case 35:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.fetch({ command: globalCommandId }))];
            case 36:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ command: globalCommandId, roles: [testGuildId] }))];
            case 37:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ command: globalCommandId, users: [testUserId] }))];
            case 38:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ command: globalCommandId, roles: [testGuildId], users: [testUserId] }))];
            case 39:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.set({
                        command: globalCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 40:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.set({
                        fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }]
                    }))];
            case 41:
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.add({
                        command: globalCommandId,
                        // @ts-expect-error
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 42:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId }))];
            case 43:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.fetch({ guild: testGuildId }))];
            case 44:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.fetch({ command: globalCommandId, guild: testGuildId }))];
            case 45:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] }))];
            case 46:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] }))];
            case 47:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({
                        command: globalCommandId,
                        // @ts-expect-error
                        guild: testGuildId,
                        roles: [testGuildId],
                        users: [testUserId]
                    }))];
            case 48:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.set({
                        command: globalCommandId,
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 49:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.set({
                        // @ts-expect-error
                        guild: testGuildId,
                        fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }]
                    }))];
            case 50:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 51:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.has({ permissionId: testGuildId }))];
            case 52:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ roles: [testGuildId] }))];
            case 53:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ users: [testUserId] }))];
            case 54:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.remove({ roles: [testGuildId], users: [testUserId] }))];
            case 55:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 56:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildPermissionsManager === null || guildPermissionsManager === void 0 ? void 0 : guildPermissionsManager.set({
                        command: globalCommandId,
                        fullPermissions: [{ id: globalCommandId, permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }]
                    }))];
            case 57:
                // @ts-expect-error
                _m.sent();
                // Permissions from cached global ApplicationCommand
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.add({
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 58:
                // Permissions from cached global ApplicationCommand
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.has({ guild: testGuildId, permissionId: testGuildId }))];
            case 59:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.fetch({ guild: testGuildId }))];
            case 60:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ guild: testGuildId, roles: [testGuildId] }))];
            case 61:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ guild: testGuildId, users: [testUserId] }))];
            case 62:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] }))];
            case 63:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.set({
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 64:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.add({
                        // @ts-expect-error
                        command: globalCommandId,
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 65:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.has({ command: globalCommandId, guild: testGuildId, permissionId: testGuildId }))];
            case 66:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.fetch({ command: globalCommandId, guild: testGuildId }))];
            case 67:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ command: globalCommandId, guild: testGuildId, roles: [testGuildId] }))];
            case 68:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ command: globalCommandId, guild: testGuildId, users: [testUserId] }))];
            case 69:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({
                        // @ts-expect-error
                        command: globalCommandId,
                        guild: testGuildId,
                        roles: [testGuildId],
                        users: [testUserId]
                    }))];
            case 70:
                _m.sent();
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.set({
                        // @ts-expect-error
                        command: globalCommandId,
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 71:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 72:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.has({ permissionId: testGuildId }))];
            case 73:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.fetch({}))];
            case 74:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ roles: [testGuildId] }))];
            case 75:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ users: [testUserId] }))];
            case 76:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.remove({ roles: [testGuildId], users: [testUserId] }))];
            case 77:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (globalCommand === null || globalCommand === void 0 ? void 0 : globalCommand.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 78:
                // @ts-expect-error
                _m.sent();
                // Permissions from cached guild ApplicationCommand
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 79:
                // Permissions from cached guild ApplicationCommand
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.has({ permissionId: testGuildId }))];
            case 80:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.fetch({}))];
            case 81:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ roles: [testGuildId] }))];
            case 82:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ users: [testUserId] }))];
            case 83:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ roles: [testGuildId], users: [testUserId] }))];
            case 84:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 85:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.add({
                        // @ts-expect-error
                        command: globalCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 86:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.has({ command: guildCommandId, permissionId: testGuildId }))];
            case 87:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ command: guildCommandId, roles: [testGuildId] }))];
            case 88:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ command: guildCommandId, users: [testUserId] }))];
            case 89:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({
                        // @ts-expect-error
                        command: guildCommandId,
                        roles: [testGuildId],
                        users: [testUserId]
                    }))];
            case 90:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.set({
                        // @ts-expect-error
                        command: guildCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 91:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.add({
                        // @ts-expect-error
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 92:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.has({ guild: testGuildId, permissionId: testGuildId }))];
            case 93:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ guild: testGuildId, roles: [testGuildId] }))];
            case 94:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ guild: testGuildId, users: [testUserId] }))];
            case 95:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] }))];
            case 96:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGlobal === null || guildCommandFromGlobal === void 0 ? void 0 : guildCommandFromGlobal.permissions.set({
                        // @ts-expect-error
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 97:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.add({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 98:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.has({ permissionId: testGuildId }))];
            case 99:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.fetch({}))];
            case 100:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ roles: [testGuildId] }))];
            case 101:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ users: [testUserId] }))];
            case 102:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ roles: [testGuildId], users: [testUserId] }))];
            case 103:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.set({ permissions: [{ type: 'ROLE', id: testGuildId, permission: true }] }))];
            case 104:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.add({
                        // @ts-expect-error
                        command: globalCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 105:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.has({ command: guildCommandId, permissionId: testGuildId }))];
            case 106:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ command: guildCommandId, roles: [testGuildId] }))];
            case 107:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ command: guildCommandId, users: [testUserId] }))];
            case 108:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({
                        // @ts-expect-error
                        command: guildCommandId,
                        roles: [testGuildId],
                        users: [testUserId]
                    }))];
            case 109:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.set({
                        // @ts-expect-error
                        command: guildCommandId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 110:
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.add({
                        // @ts-expect-error
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 111:
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.has({ guild: testGuildId, permissionId: testGuildId }))];
            case 112:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ guild: testGuildId, roles: [testGuildId] }))];
            case 113:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ guild: testGuildId, users: [testUserId] }))];
            case 114:
                // @ts-expect-error
                _m.sent();
                // @ts-expect-error
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.remove({ guild: testGuildId, roles: [testGuildId], users: [testUserId] }))];
            case 115:
                // @ts-expect-error
                _m.sent();
                return [4 /*yield*/, (guildCommandFromGuild === null || guildCommandFromGuild === void 0 ? void 0 : guildCommandFromGuild.permissions.set({
                        // @ts-expect-error
                        guild: testGuildId,
                        permissions: [{ type: 'ROLE', id: testGuildId, permission: true }]
                    }))];
            case 116:
                _m.sent();
                (_k = client.application) === null || _k === void 0 ? void 0 : _k.commands.permissions.set({
                    guild: testGuildId,
                    fullPermissions: (_l = originalPermissions === null || originalPermissions === void 0 ? void 0 : originalPermissions.map(function (permissions, id) { return ({ permissions: permissions, id: id }); })) !== null && _l !== void 0 ? _l : []
                });
                return [2 /*return*/];
        }
    });
}); });
client.on('guildCreate', function (g) {
    var channel = g.channels.cache.random();
    if (!channel)
        return;
    channel.setName('foo').then(function (updatedChannel) {
        console.log("New channel name: " + updatedChannel.name);
    });
    // @ts-expect-error no options
    assertIsPromiseMember(g.members.add(testUserId));
    // @ts-expect-error no access token
    assertIsPromiseMember(g.members.add(testUserId, {}));
    // @ts-expect-error invalid role resolvable
    assertIsPromiseMember(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', roles: [g.roles.cache] }));
    assertType(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken', fetchWhenExisting: false }));
    assertIsPromiseMember(g.members.add(testUserId, { accessToken: 'totallyRealAccessToken' }));
    assertIsPromiseMember(g.members.add(testUserId, {
        accessToken: 'totallyRealAccessToken',
        mute: true,
        deaf: false,
        roles: [g.roles.cache.first()],
        force: true,
        fetchWhenExisting: true
    }));
});
client.on('messageReactionRemoveAll', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("messageReactionRemoveAll - id: " + message.id + " (" + message.id.length + ")");
                if (!message.partial) return [3 /*break*/, 2];
                return [4 /*yield*/, message.fetch()];
            case 1:
                message = _a.sent();
                _a.label = 2;
            case 2:
                console.log("messageReactionRemoveAll - content: " + message.content);
                return [2 /*return*/];
        }
    });
}); });
client.on('messageCreate', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, attachment, embed, component, _a, buttonCollector_1, buttonCollector, selectMenuCollector, defaultCollector, semiDefaultCollector, semiDefaultCollectorChannel, interactionOptions, webhook;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                channel = message.channel;
                assertIsMessage(channel.send('string'));
                assertIsMessage(channel.send({}));
                assertIsMessage(channel.send({ embeds: [] }));
                attachment = new _1.MessageAttachment('file.png');
                embed = new _1.MessageEmbed();
                assertIsMessage(channel.send({ files: [attachment] }));
                assertIsMessage(channel.send({ embeds: [embed] }));
                assertIsMessage(channel.send({ embeds: [embed], files: [attachment] }));
                if (!message.inGuild()) return [3 /*break*/, 3];
                assertType(message);
                return [4 /*yield*/, message.awaitMessageComponent({ componentType: 'BUTTON' })];
            case 1:
                component = _b.sent();
                assertType(component);
                _a = assertType;
                return [4 /*yield*/, component.reply({ fetchReply: true })];
            case 2:
                _a.apply(void 0, [_b.sent()]);
                buttonCollector_1 = message.createMessageComponentCollector({ componentType: 'BUTTON' });
                assertType(buttonCollector_1);
                assertType(message.channel);
                _b.label = 3;
            case 3:
                assertType(message.channel);
                // @ts-expect-error
                assertType(message.channel);
                // @ts-expect-error
                channel.send();
                // @ts-expect-error
                channel.send({ another: 'property' });
                buttonCollector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
                assertType(message.awaitMessageComponent({ componentType: 'BUTTON' }));
                assertType(channel.awaitMessageComponent({ componentType: 'BUTTON' }));
                assertType(buttonCollector);
                selectMenuCollector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU' });
                assertType(message.awaitMessageComponent({ componentType: 'SELECT_MENU' }));
                assertType(channel.awaitMessageComponent({ componentType: 'SELECT_MENU' }));
                assertType(selectMenuCollector);
                defaultCollector = message.createMessageComponentCollector();
                assertType(message.awaitMessageComponent());
                assertType(channel.awaitMessageComponent());
                assertType(defaultCollector);
                semiDefaultCollector = message.createMessageComponentCollector({ time: 10000 });
                assertType(semiDefaultCollector);
                semiDefaultCollectorChannel = message.createMessageComponentCollector({ time: 10000 });
                assertType(semiDefaultCollectorChannel);
                interactionOptions = message.createMessageComponentCollector({ interactionType: 'APPLICATION_COMMAND' });
                // Make sure filter parameters are properly inferred.
                message.createMessageComponentCollector({
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                message.createMessageComponentCollector({
                    componentType: 'BUTTON',
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                message.createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                message.awaitMessageComponent({
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                message.awaitMessageComponent({
                    componentType: 'BUTTON',
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                message.awaitMessageComponent({
                    componentType: 'SELECT_MENU',
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                return [4 /*yield*/, message.fetchWebhook()];
            case 4:
                webhook = _b.sent();
                if (webhook.isChannelFollower()) {
                    assertType(webhook.sourceGuild);
                    assertType(webhook.sourceChannel);
                }
                else if (webhook.isIncoming()) {
                    assertType(webhook.token);
                }
                // @ts-expect-error
                assertType(webhook.sourceGuild);
                // @ts-expect-error
                assertType(webhook.sourceChannel);
                // @ts-expect-error
                assertType(webhook.token);
                channel.awaitMessageComponent({
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                channel.awaitMessageComponent({
                    componentType: 'BUTTON',
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                channel.awaitMessageComponent({
                    componentType: 'SELECT_MENU',
                    filter: function (i) {
                        assertType(i);
                        return true;
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
client.on('interaction', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var button, actionRow;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                assertType(interaction.guildId);
                assertType(interaction.channelId);
                assertType(interaction.member);
                if (!interaction.isCommand())
                    return [2 /*return*/];
                void new _1.MessageActionRow();
                button = new _1.MessageButton();
                actionRow = new _1.MessageActionRow({ components: [button] });
                return [4 /*yield*/, interaction.reply({ content: 'Hi!', components: [actionRow] })];
            case 1:
                _a.sent();
                // @ts-expect-error
                return [4 /*yield*/, interaction.reply({ content: 'Hi!', components: [[button]] })];
            case 2:
                // @ts-expect-error
                _a.sent();
                // @ts-expect-error
                void new _1.MessageActionRow({});
                // @ts-expect-error
                return [4 /*yield*/, interaction.reply({ content: 'Hi!', components: [button] })];
            case 3:
                // @ts-expect-error
                _a.sent();
                if (interaction.isMessageComponent()) {
                    assertType(interaction.channelId);
                }
                return [2 /*return*/];
        }
    });
}); });
client.login('absolutely-valid-token');
// Test client conditional types
client.on('ready', function (client) {
    assertType(client);
});
assertType(loggedInClient.application);
assertType(loggedInClient.readyAt);
assertType(loggedInClient.readyTimestamp);
assertType(loggedInClient.token);
assertType(loggedInClient.uptime);
assertType(loggedInClient.user);
assertType(loggedOutClient.application);
assertType(loggedOutClient.readyAt);
assertType(loggedOutClient.readyTimestamp);
assertType(loggedOutClient.token);
assertType(loggedOutClient.uptime);
assertType(loggedOutClient.user);
assertType(serialize(undefined));
assertType(serialize(null));
assertType(serialize([1, 2, 3]));
assertType(serialize(new Set([1, 2, 3])));
assertType(serialize(new Map([
    [1, '2'],
    [2, '4'],
])));
assertType(serialize(new _1.Permissions(_1.Permissions.FLAGS.ATTACH_FILES)));
assertType(serialize(new _1.Intents(_1.Intents.FLAGS.GUILDS)));
assertType(serialize(new _1.Collection([
    [1, '2'],
    [2, '4'],
])));
assertType(serialize(Symbol('a')));
assertType(serialize(function () { }));
assertType(serialize(BigInt(42)));
assertType(shardingManager.broadcastEval(function () { return 1; }));
assertType(shardClientUtil.broadcastEval(function () { return 1; }));
assertType(shardingManager.broadcastEval(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, 1];
}); }); }));
assertType(shardClientUtil.broadcastEval(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, 1];
}); }); }));
// Test whether the structures implement send
assertType(dmChannel.send);
assertType(threadChannel);
assertType(newsChannel);
assertType(textChannel);
assertType(user);
assertType(guildMember);
assertType(dmChannel.lastMessage);
assertType(threadChannel.lastMessage);
assertType(newsChannel.lastMessage);
assertType(textChannel.lastMessage);
notPropertyOf(user, 'lastMessage');
notPropertyOf(user, 'lastMessageId');
notPropertyOf(guildMember, 'lastMessage');
notPropertyOf(guildMember, 'lastMessageId');
messageCollector.on('collect', function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    assertType(args);
});
reactionCollector.on('dispose', function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    assertType(args);
});
// Make sure the properties are typed correctly, and that no backwards properties
// (K -> V and V -> K) exist:
assertType(_1.Constants.Events.MESSAGE_CREATE);
assertType(_1.Constants.ShardEvents.CLOSE);
assertType(_1.Constants.Status.CONNECTING);
assertType(_1.Constants.Opcodes.DISPATCH);
assertType(_1.Constants.ClientApplicationAssetTypes.BIG);
{
    assertType(applicationCommandManager.create(applicationCommandData));
    assertType(applicationCommandManager.create(applicationCommandData, '0'));
    assertType(applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData));
    assertType(applicationCommandManager.edit(applicationCommandResolvable, applicationCommandData, '0'));
    assertType(applicationCommandManager.set([applicationCommandData]));
    assertType(applicationCommandManager.set([applicationCommandData], '0'));
}
{
    // Options aren't allowed on this command type.
    // @ts-expect-error
    applicationNonChoiceOptionData.choices;
}
{
    // Choices should be available.
    applicationChoiceOptionData.choices;
}
{
    assertType(applicationSubGroupCommandData.type);
    assertType(applicationSubGroupCommandData.options);
}
{
    assertType(applicationSubCommandData.type);
    // Check that only subcommands can have no subcommand or subcommand group sub-options.
    assertType(applicationSubCommandData.options);
}
assertType(guildApplicationCommandManager.fetch());
assertType(guildApplicationCommandManager.fetch(undefined, {}));
assertType(guildApplicationCommandManager.fetch('0'));
{
    assertType(guildChannelManager.create('name', { type: 'GUILD_VOICE' }));
    assertType(guildChannelManager.create('name', { type: 'GUILD_CATEGORY' }));
    assertType(guildChannelManager.create('name', { type: 'GUILD_TEXT' }));
    assertType(guildChannelManager.create('name', { type: 'GUILD_NEWS' }));
    assertType(guildChannelManager.create('name', { type: 'GUILD_STORE' }));
    assertType(guildChannelManager.create('name', { type: 'GUILD_STAGE_VOICE' }));
    assertType(guildChannelManager.fetch());
    assertType(guildChannelManager.fetch(undefined, {}));
    assertType(guildChannelManager.fetch('0'));
}
assertType(roleManager.fetch());
assertType(roleManager.fetch(undefined, {}));
assertType(roleManager.fetch('0'));
assertType(guildEmojiManager.fetch());
assertType(guildEmojiManager.fetch(undefined, {}));
assertType(guildEmojiManager.fetch('0'));
assertType(typing.user);
if (typing.user.partial)
    assertType(typing.user.username);
assertType(typing.channel);
if (typing.channel.partial)
    assertType(typing.channel.lastMessageId);
assertType(typing.member);
assertType(typing.guild);
if (typing.inGuild()) {
    assertType(typing.channel.guild);
    assertType(typing.guild);
}
// Test partials structures
client.on('guildMemberRemove', function (member) {
    if (member.partial)
        return assertType(member.joinedAt);
    assertType(member.joinedAt);
});
client.on('messageReactionAdd', function (reaction) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!reaction.partial) return [3 /*break*/, 2];
                assertType(reaction.count);
                return [4 /*yield*/, reaction.fetch()];
            case 1:
                reaction = _a.sent();
                _a.label = 2;
            case 2:
                assertType(reaction.count);
                if (reaction.message.partial)
                    return [2 /*return*/, assertType(reaction.message.content)];
                assertType(reaction.message.content);
                return [2 /*return*/];
        }
    });
}); });
if (interaction.inGuild())
    assertType(interaction.guildId);
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, btn, optionalOption, requiredOption;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (interaction.inCachedGuild()) {
                    assertType(interaction.member);
                    // @ts-expect-error
                    assertType(interaction);
                    assertType(interaction);
                }
                else if (interaction.inRawGuild()) {
                    assertType(interaction.member);
                    // @ts-expect-error
                    consumeCachedInteraction(interaction);
                }
                else {
                    assertType(interaction.member);
                    // @ts-expect-error
                    consumeCachedInteraction(interaction);
                }
                if (interaction.isContextMenu()) {
                    assertType(interaction);
                    if (interaction.inCachedGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction);
                    }
                    else if (interaction.inRawGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                    }
                    else if (interaction.inGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                    }
                }
                if (interaction.isButton()) {
                    assertType(interaction);
                    if (interaction.inCachedGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                    else if (interaction.inRawGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                    else if (interaction.inGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                }
                if (interaction.isMessageComponent()) {
                    assertType(interaction);
                    if (interaction.inCachedGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                    else if (interaction.inRawGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                    else if (interaction.inGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                }
                if (interaction.isSelectMenu()) {
                    assertType(interaction);
                    if (interaction.inCachedGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                    else if (interaction.inRawGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                    else if (interaction.inGuild()) {
                        assertType(interaction);
                        assertType(interaction.guild);
                        assertType(interaction.reply({ fetchReply: true }));
                    }
                }
                if (!interaction.isCommand()) return [3 /*break*/, 6];
                if (!interaction.inRawGuild()) return [3 /*break*/, 1];
                // @ts-expect-error
                consumeCachedCommand(interaction);
                assertType(interaction);
                assertType(interaction.reply({ fetchReply: true }));
                assertType(interaction.options.getMember('test'));
                assertType(interaction.options.getMember('test', true));
                assertType(interaction.options.getChannel('test', true));
                assertType(interaction.options.getRole('test', true));
                assertType(interaction.options.getMessage('test', true));
                return [3 /*break*/, 5];
            case 1:
                if (!interaction.inCachedGuild()) return [3 /*break*/, 4];
                return [4 /*yield*/, interaction.reply({ fetchReply: true })];
            case 2:
                msg = _a.sent();
                return [4 /*yield*/, msg.awaitMessageComponent({ componentType: 'BUTTON' })];
            case 3:
                btn = _a.sent();
                assertType(msg);
                assertType(btn);
                assertType(interaction);
                assertType(interaction.options.getMember('test', true));
                assertType(interaction.options.getMember('test'));
                assertType(interaction);
                assertType(interaction.reply({ fetchReply: true }));
                assertType(interaction.options.getChannel('test', true));
                assertType(interaction.options.getRole('test', true));
                assertType(interaction.options.getMessage('test', true));
                return [3 /*break*/, 5];
            case 4:
                // @ts-expect-error
                consumeCachedCommand(interaction);
                assertType(interaction);
                assertType(interaction.reply({ fetchReply: true }));
                assertType(interaction.options.getMember('test'));
                assertType(interaction.options.getMember('test', true));
                assertType(interaction.options.getChannel('test', true));
                assertType(interaction.options.getRole('test', true));
                assertType(interaction.options.getMessage('test', true));
                _a.label = 5;
            case 5:
                assertType(interaction);
                assertType(interaction.options);
                assertType(interaction.options.data);
                optionalOption = interaction.options.get('name');
                requiredOption = interaction.options.get('name', true);
                assertType(optionalOption);
                assertType(requiredOption);
                assertType(requiredOption.options);
                assertType(interaction.options.getString('name', booleanValue));
                assertType(interaction.options.getString('name', false));
                assertType(interaction.options.getString('name', true));
                assertType(interaction.options.getSubcommand());
                assertType(interaction.options.getSubcommand(true));
                assertType(interaction.options.getSubcommand(booleanValue));
                assertType(interaction.options.getSubcommand(false));
                assertType(interaction.options.getSubcommandGroup());
                assertType(interaction.options.getSubcommandGroup(true));
                assertType(interaction.options.getSubcommandGroup(booleanValue));
                assertType(interaction.options.getSubcommandGroup(false));
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });

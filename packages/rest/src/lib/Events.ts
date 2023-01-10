import type { Collection } from '@discordjs/collection';
import { Evt } from 'evt';
import type { Dispatcher } from 'undici';
import type { APIRequest, InvalidRequestWarningData, RateLimitData } from './REST.js';
import type { HashData } from './RequestManager.js';
import type { IHandler } from './handlers/IHandler.js';

export const _evtRestDebug = Evt.create<string>();
export const _evtRatelimited = Evt.create<RateLimitData>();
export const _evtInvalidRequestWarning = Evt.create<InvalidRequestWarningData>();
export const _evtHashSweep = Evt.create<Collection<string, HashData>>();
export const _evtHandlerSweep = Evt.create<Collection<string, IHandler>>();
export const _evtResponse = Evt.create<{ request: APIRequest; response: Dispatcher.ResponseData }>();

export const evtRestDebug = Evt.asNonPostable(_evtRestDebug);
export const evtRatelimited = Evt.asNonPostable(_evtRatelimited);
export const evtInvalidRequestWarning = Evt.asNonPostable(_evtInvalidRequestWarning);
export const evtHashSweep = Evt.asNonPostable(_evtHashSweep);
export const evtHandlerSweep = Evt.asNonPostable(_evtHandlerSweep);
export const evtResponse = Evt.asNonPostable(_evtResponse);

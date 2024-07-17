import Client from '../client/Client';

declare class BaseManager {
  readonly client: Client;
  constructor(client: Client);
}

export = BaseManager;

import Action from './Action';

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.id);
    if (channel) {
      const old = channel._update(data);
      return {
        old,
        updated: channel,
      };
    }

    return {};
  }
}

export default ChannelUpdateAction;

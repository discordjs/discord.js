import Action from './Action';
import { Events } from '../../util/Constants';

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.channels.has(data.id);
    const channel = client.channels.create(data);
    if (!existing && channel) {
      client.emit(Events.CHANNEL_CREATE, channel);
    }
    return { channel };
  }
}

export default ChannelCreateAction;

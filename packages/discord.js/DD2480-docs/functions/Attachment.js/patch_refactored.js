import { bc_re } from './patch.test.js';

const updateSize = (obj, data) => {
  if ('size' in data) {
    obj.size = data.size;
  }
};

const updateURL = (obj, data) => {
  if ('url' in data) {
    obj.url = data.url;
  }
};

const updateProxyURL = (obj, data) => {
  if ('proxy_url' in data) {
    obj.proxyURL = data.proxy_url;
  }
};

const updateHeight = (obj, data) => {
  if ('height' in data) {
    obj.height = data.height;
  } else {
    obj.height ??= null;
  }
};

const updateWidth = (obj, data) => {
  if ('width' in data) {
    obj.width = data.width;
  } else {
    obj.width ??= null;
  }
};

const updateContentType = (obj, data) => {
  if ('content_type' in data) {
    obj.contentType = data.content_type;
  } else {
    obj.contentType ??= null;
  }
};

const updateDescription = (obj, data) => {
  if ('description' in data) {
    obj.description = data.description;
  } else {
    obj.description ??= null;
  }
};

const updateDurationSecs = (obj, data) => {
  if ('duration_secs' in data) {
    obj.duration = data.duration_secs;
  } else {
    obj.duration ??= null;
  }
};

const updateWaveform = (obj, data) => {
  if ('waveform' in data) {
    obj.waveform = data.waveform;
  } else {
    obj.waveform ??= null;
  }
};

const updateFlags = (obj, data) => {
  if ('flags' in data) {
    obj.flags = new AttachmentFlagsBitField(data.flags).freeze();
  } else {
    obj.flags ??= new AttachmentFlagsBitField().freeze();
  }
};

const updateTitle = (obj, data) => {
  if ('title' in data) {
    obj.title = data.title;
  } else {
    obj.title ??= null;
  }
};

export class AttachmentRe {
  constructor() {}

  _patch(data) {
    this.id = data.id;
    bc_re.cover(1);
    updateSize(this, data);
    updateURL(this, data);
    updateProxyURL(this, data);
    updateHeight(this, data);
    updateWidth(this, data);
    updateContentType(this, data);
    updateDescription(this, data);

    this.ephemeral = data.ephemeral ?? false;

    updateDurationSecs(this, data);
    updateWaveform(this, data);
    updateFlags(this, data);
    updateTitle(this, data);
  }
}

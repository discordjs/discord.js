const DocumentedItem = require('./DocumentedItem');
const DocumentedItemMeta = require('./DocumentedItemMeta');
const DocumentedConstructor = require('./DocumentedConstructor');
const DocumentedFunction = require('./DocumentedFunction');
const DocumentedMember = require('./DocumentedMember');
const DocumentedEvent = require('./DocumentedEvent');

/*
{ id: 'VoiceChannel',
  longname: 'VoiceChannel',
  name: 'VoiceChannel',
  scope: 'global',
  kind: 'class',
  augments: [ 'GuildChannel' ],
  description: 'Represents a Server Voice Channel on Discord.',
  meta:
   { lineno: 7,
     filename: 'VoiceChannel.js',
     path: 'src/structures' },
  order: 232 }
  */

class DocumentedClass extends DocumentedItem {

  constructor(docParent, data) {
    super(docParent, data);
    this.props = new Map();
    this.methods = new Map();
    this.events = new Map();
  }

  add(item) {
    if (item instanceof DocumentedConstructor) {
      if (this.classConstructor) {
        throw new Error(`Doc ${this.directData.name} already has constructor - ${this.directData.classConstructor}`);
      }
      this.classConstructor = item;
    } else if (item instanceof DocumentedFunction) {
      if (this.methods.get(item.directData.name)) {
        throw new Error(`Doc ${this.directData.name} already has method ${item.directData.name}`);
      }
      this.methods.set(item.directData.name, item);
    } else if (item instanceof DocumentedMember) {
      if (this.props.get(item.directData.name)) {
        throw new Error(`Doc ${this.directData.name} already has prop ${item.directData.name}`);
      }
      this.props.set(item.directData.name, item);
    } else if (item instanceof DocumentedEvent) {
      if (this.events.get(item.directData.name)) {
        throw new Error(`Doc ${this.directData.name} already has event ${item.directData.name}`);
      }
      this.events.set(item.directData.name, item);
    }
  }

  registerMetaInfo(data) {
    super.registerMetaInfo(data);
    this.directData = data;
    this.directData.meta = new DocumentedItemMeta(this, data.meta);
  }

  serialize() {
    super.serialize();
    const { id, name, description, meta, augments, access } = this.directData;
    const serialized = {
      id,
      name,
      description,
      meta: meta.serialize(),
      extends: augments,
      access,
    };
    if (this.classConstructor) {
      serialized.classConstructor = this.classConstructor.serialize();
    }
    serialized.methods = Array.from(this.methods.values()).map(m => m.serialize());
    serialized.properties = Array.from(this.props.values()).map(p => p.serialize());
    serialized.events = Array.from(this.events.values()).map(e => e.serialize());
    return serialized;
  }
}

module.exports = DocumentedClass;

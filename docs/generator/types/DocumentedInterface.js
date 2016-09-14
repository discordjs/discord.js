const DocumentedClass = require('./DocumentedClass');

/*
{ id: 'TextBasedChannel',
  longname: 'TextBasedChannel',
  name: 'TextBasedChannel',
  scope: 'global',
  kind: 'interface',
  classdesc: 'Interface for classes that have text-channel-like features',
  params: [],
  meta:
   { lineno: 5,
     filename: 'TextBasedChannel.js',
     path: 'src/structures/interface' },
  order: 175 }
  */

class DocumentedInterface extends DocumentedClass {
  registerMetaInfo(data) {
    super.registerMetaInfo(data);
    this.directData = data;
    // this.directData.meta = new DocumentedItemMeta(this, data.meta);
  }

  serialize() {
    const serialized = super.serialize();
    serialized.description = this.directData.classdesc;
    return serialized;
  }
}

module.exports = DocumentedInterface;

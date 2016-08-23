const DocumentedItem = require('./DocumentedItem');
const DocumentedItemMeta = require('./DocumentedItemMeta');
const DocumentedVarType = require('./DocumentedVarType');

/*
{ id: 'StringResolvable',
  longname: 'StringResolvable',
  name: 'StringResolvable',
  scope: 'global',
  kind: 'typedef',
  description: 'Data that can be resolved to give a String...',
  type: { names: [ 'String', 'Array', 'Object' ] },
  meta:
   { lineno: 142,
     filename: 'ClientDataResolver.js',
     path: 'src/client' },
  order: 37 }
*/

class DocumentedTypeDef extends DocumentedItem {

  registerMetaInfo(data) {
    super.registerMetaInfo(data);
    this.directData = data;
    this.directData.meta = new DocumentedItemMeta(this, data.meta);
    this.directData.type = new DocumentedVarType(this, data.type);
  }

  serialize() {
    super.serialize();
    const { id, name, description, type, access, meta } = this.directData;
    return {
      id,
      name,
      description,
      type: type.serialize(),
      access,
      meta: meta.serialize(),
    };
  }

}

module.exports = DocumentedTypeDef;

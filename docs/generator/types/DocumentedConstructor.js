const DocumentedItem = require('./DocumentedItem');

/*
{ id: 'Client()',
  longname: 'Client',
  name: 'Client',
  kind: 'constructor',
  description: 'Creates an instance of Client.',
  memberof: 'Client',
  params:
   [ { type: [Object],
       optional: true,
       description: 'options to pass to the client',
       name: 'options' } ],
  order: 10 }
*/

class DocumentedConstructor extends DocumentedItem {

  registerMetaInfo(data) {
    this.directData = data;
  }

  serialize() {
    super.serialize();
    const { id, name, description, memberof, access } = this.directData;
    return { id, name, description, memberof, access };
  }

}

module.exports = DocumentedConstructor;

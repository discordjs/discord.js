const DocumentedItem = require('./DocumentedItem');
const DocumentedParam = require('./DocumentedParam');

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
    super.registerMetaInfo(data);
    this.directData = data;
    const newParams = [];
    for (const param of data.params) {
      newParams.push(new DocumentedParam(this, param));
    }
    this.directData.params = newParams;
  }

  serialize() {
    super.serialize();
    const { id, name, description, memberof, access, params } = this.directData;
    return {
      id,
      name,
      description,
      memberof,
      access,
      params: params.map(p => p.serialize()),
    };
  }

}

module.exports = DocumentedConstructor;

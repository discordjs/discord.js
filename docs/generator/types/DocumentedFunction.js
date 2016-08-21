const DocumentedItem = require('./DocumentedItem');
const DocumentedItemMeta = require('./DocumentedItemMeta');
const DocumentedVarType = require('./DocumentedVarType');
const DocumentedParam = require('./DocumentedParam');

/*
{
  "id":"ClientUser#sendTTSMessage",
  "longname":"ClientUser#sendTTSMessage",
  "name":"sendTTSMessage",
  "scope":"instance",
  "kind":"function",
  "inherits":"User#sendTTSMessage",
  "inherited":true,
  "implements":[
    "TextBasedChannel#sendTTSMessage"
  ],
  "description":"Send a text-to-speech message to this channel",
  "memberof":"ClientUser",
  "params":[
    {
      "type":{
        "names":[
          "String"
        ]
      },
      "description":"the content to send",
      "name":"content"
    }
  ],
  "examples":[
    "// send a TTS message..."
  ],
  "returns":[
    {
      "type":{
        "names":[
          "Promise.<Message>"
        ]
      }
    }
  ],
  "meta":{
    "lineno":38,
    "filename":"TextBasedChannel.js",
    "path":src/structures/interface"
  },
  "order":293
}
  */

class DocumentedFunction extends DocumentedItem {

  registerMetaInfo(data) {
    super.registerMetaInfo(data);
    this.directData = data;
    this.directData.meta = new DocumentedItemMeta(this, data.meta);
    this.directData.returns = new DocumentedVarType(this, data.returns ? data.returns[0].type : {
      names: ['null'],
    });
    const newParams = [];
    for (const param of data.params) {
      newParams.push(new DocumentedParam(this, param));
    }
    this.directData.params = newParams;
  }

  serialize() {
    super.serialize();
    const {
      id, name, description, memberof, examples, inherits, inherited, meta, returns, params, access,
    } = this.directData;
    const serialized = {
      id,
      access,
      name,
      description,
      memberof,
      examples,
      inherits,
      inherited,
      meta: meta.serialize(),
      returns: returns.serialize(),
      params: params.map(p => p.serialize()),
    };
    serialized.implements = this.directData.implements;
    return serialized;
  }
}

module.exports = DocumentedFunction;

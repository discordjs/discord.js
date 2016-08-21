const DocumentedItem = require('./DocumentedItem');
const DocumentedItemMeta = require('./DocumentedItemMeta');

/*
{
  "id":"Client#event:guildMemberRolesUpdate",
  "longname":"Client#event:guildMemberRolesUpdate",
  "name":"guildMemberRolesUpdate",
  "scope":"instance",
  "kind":"event",
  "description":"Emitted whenever a Guild Member's Roles change - i.e. new role or removed role",
  "memberof":"Client",
  "params":[
    {
      "type":{
        "names":[
          "Guild"
        ]
      },
      "description":"the guild that the update affects",
      "name":"guild"
    },
    {
      "type":{
        "names":[
          "Array.<Role>"
        ]
      },
      "description":"the roles before the update",
      "name":"oldRoles"
    },
    {
      "type":{
        "names":[
          "Guild"
        ]
      },
      "description":"the roles after the update",
      "name":"newRoles"
    }
  ],
  "meta":{
    "lineno":91,
    "filename":"Guild.js",
    "path":"src/structures"
  },
  "order":110
}
*/

class DocumentedEvent extends DocumentedItem {

  registerMetaInfo(data) {
    this.directData = data;
    this.directData.meta = new DocumentedItemMeta(this, data.meta);
  }

  serialize() {
    super.serialize();
    const { id, name, description, memberof, meta } = this.directData;
    return {
      id,
      name,
      description,
      memberof,
      meta: meta.serialize(),
    };
  }

}

module.exports = DocumentedEvent;

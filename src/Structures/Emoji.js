"use strict";

import {Endpoints} from "../Constants";
/* example data
{
  id: '164585980739846145'
  name: 'wlfSS',
  roles: [ '135829612780322816' ],
  require_colons: false,
  managed: true,
}
*/

export default class Emoji {
  constructor(data, server) {
    this.server = server;
    this.id = data.id;
    this.name = data.name;
    this.roleList = data.roles;
    this.colons = data.require_colons;
    this.managed = data.managed;
  }

  get roles() {
    var roleGroup = [];

    if (this.managed) {
      for (var i = 0; i < this.roleList.length; i++) {
        var roleID = this.roleList[i].toString();
        var role = this.server.roles.get("id", roleID);
        roleGroup.push(role);
      }
    }
    return roleGroup
  }

  get getURL() {
    return Endpoints.EMOJI(this.id);
  }

  toObject() {
    let keys = ['id', 'name', 'roleList', 'colons', 'managed'],
      obj = {};

    for (let k of keys) {
      obj[k] = this[k];
    }

    return obj;
  }
}

'use strict';

module.exports = (client, { d: data }) => {
  // data: { id: userId, note: "note text" }
  client.notes.cache.set(data.id, data.note);
};

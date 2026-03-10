'use strict';

module.exports = (client, { d: data }) => {
  client.settings._patch(data);
};

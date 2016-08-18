const request = require('superagent');

const data = {
  branches: null,
  docs: {},
};

function build(docs) {
  const links = {
    String: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
    Array: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    Map: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
    Object: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
    Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
    Number: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
  };
  console.log(docs);
  for (const jsclass in docs.json.classes) {
    links[jsclass] = 'class';
  }
  docs.links = links;
  return docs;
}

const store = {
  data,

  fetchBranches() {
    return new Promise((resolve, reject) => {
      if (data.branches) {
        resolve(data.branches);
      } else {
        request
          .get('https://api.github.com/repos/hydrabolt/discord.js/branches')
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              data.branches = res.body;
              resolve(data.branches);
            }
          });
      }
    });
  },

  fetchDocs(tag) {
    return new Promise((resolve, reject) => {
      if (data.docs[tag]) {
        resolve(data.docs[tag]);
      } else {
        request
          .get(`https://raw.githubusercontent.com/hydrabolt/discord.js/${tag}/docs/docs.json`)
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              data.docs[tag] = build(res.body || JSON.parse(res.text));
              resolve(data.docs[tag]);
            }
          });
      }
    });
  },
};

module.exports = store;

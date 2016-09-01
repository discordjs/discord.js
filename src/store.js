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
  docs.classes = docs.classes.sort((a, b) => a.name.localeCompare(b.name));
  docs.typedefs = docs.typedefs.sort((a, b) => a.name.localeCompare(b.name));
  for (const jsclass of docs.classes) {
    links[jsclass.name] = 'class';
    if (jsclass.events) {
      jsclass.events = jsclass.events.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (jsclass.properties) {
      jsclass.properties = jsclass.properties.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (jsclass.methods) {
      jsclass.methods = jsclass.methods.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  for (const jsclass of docs.typedefs) {
    links[jsclass.name] = 'typedef';
  }
  docs.links = links;
  return docs;
}

function parseDocs(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return alert(e);
  }
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
              console.log(res);
              data.docs[tag] = build(res.body || parseDocs(res.text));
              resolve(data.docs[tag]);
            }
          });
      }
    });
  },
};

module.exports = store;

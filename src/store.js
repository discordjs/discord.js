const request = require('superagent');

const data = {
  branches: null,
  docs: {},
};

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
              data.docs[tag] = res.body || JSON.parse(res.text);
              resolve(res.body);
            }
          });
      }
    });
  },
};

module.exports = store;

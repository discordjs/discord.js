const superagent = require('superagent');
const botGateway = require('./Constants').Endpoints.botGateway;

/**
 * Gets the recommended shard count from Discord
 * @param {number} token Discord auth token
 * @returns {Promise<number>} the recommended number of shards
 */
module.exports = function fetchRecommendedShards(token) {
  return new Promise((resolve, reject) => {
    if (!token) throw new Error('A token must be provided.');
    superagent.get(botGateway)
      .set('Authorization', `Bot ${token.replace(/^Bot\s*/i, '')}`)
      .end((err, res) => {
        if (err) reject(err);
        resolve(res.body.shards);
      });
  });
};

<template>
  <slide>
    <h2>Stats</h2>
    <div class="stat"><strong>{{ downloads }}</strong> downloads</div>
    <div class="stat"><strong>{{ stars }}</strong> stars</div>
    <div class="stat"><strong>{{ contributors }}</strong> contributors</div>
  </slide>
</template>
<script>

const request = require('superagent');

const data = {
  downloads: '80,000+ ',
  stars: '500+ ',
  contributors: '30+ ',
};

function load() {
  request
    .get('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js')
    .end((err, res) => {
      if (!err) {
        data.downloads = 0;
        for (const item of res.body.downloads) data.downloads += item.downloads;
        data.downloads = data.downloads.toLocaleString();
      }
    });

  request
    .get('https://api.github.com/repos/hydrabolt/discord.js')
    .end((err, res) => {
      if (!err) data.stars = `${res.body.stargazers_count}`.toLocaleString();
    });

  request
    .get('https://api.github.com/repos/hydrabolt/discord.js/contributors')
    .end((err, res) => {
      if (!err) data.contributors = `${res.body.length}`.toLocaleString();
    });
}

export default {
  data() {
    load();
    return data;
  },
};
</script>

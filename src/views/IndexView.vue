<template>
  <div class="index-view">
    <div class="slide">
      <div class="container">
        <h1>discord.js</h1>
        <div class="code">npm install --save discord.js</div><br />
        <div class="container socialmedia">
<!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/hydrabolt/discord.js" data-style="mega" data-count-href="/hydrabolt/discord.js/stargazers" data-count-api="/repos/hydrabolt/discord.js#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star hydrabolt/discord.js on GitHub">Star</a>
        </div>
      </div>
    </div>
    <div class="slide">
      <div class="container">
        <h1>About</h1>
        <p>discord.js is a JavaScript library that wraps around the <a href="https://discordapp.com/developers/docs/intro">Discord API</a> so you can make your own Bots and Applications for Discord. It handles all the communication and provides an easy-to-use interface so you can focus on doing actual work.</p>
      </div>
    </div>
    <div class="slide">
      <div class="container">
        <h1>Stats</h1>
        <div class="stats">
          <div class="stat"><b>{{ store.downloads }}</b> downloads</div>
          <div class="stat"><b>{{ store.contributors }}</b> contributors</div>
          <div class="stat"><b>{{ store.stars }}</b> stars</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      store: this.$root.store,
    };
  },
};
</script>
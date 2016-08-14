<template>
  <div class="navbar">
    <div class="container">
      <a v-link="{ path: '/' }"><div class="title">discord.js</div></a>
      <div class="links">
        <a v-link="{ path: '/docs' }"><div class="link">Docs</div></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello World!',
    };
  },
};
</script>
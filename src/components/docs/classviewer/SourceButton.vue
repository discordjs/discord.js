<template>
  <a href="https://github.com/hydrabolt/discord.js/blob/{{ $route.params.tag }}/{{ meta.path }}/{{ meta.filename }}#L{{ meta.lineno }}"> <i class="fa fa-file-text-o"></i></a>
</template>
<script>
export default {
  props: ['meta'],
};
</script>
<style lang="scss">
  a {
    text-decoration: none;
    color: #eee;
  }
  a:hover {
    color: #333;
  }
</style>
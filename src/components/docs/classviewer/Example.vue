<template>
  <div class="codeblock">
  {{{ '```js\n' + example + '```' | marked }}}
  </div>
</template>
<script>
export default {
  props: ['example'],
};
</script>
<style lang="scss" scoped>
  .codeblock {
    padding-bottom: 4px;
  }
</style>
<template><span class="var-ref" @click='$root.resolveReference(data[0])'>{{ data[0] }}</span>{{ data[1] }}</template>
<script>
export default {
  props: ['data'],
};
</script>
<style scoped lang="scss">
  .var-ref {
    color: #2196F3;
    font-weight: bold;
    font-family: 'Roboto Mono';
    cursor: pointer;
  }
</style>
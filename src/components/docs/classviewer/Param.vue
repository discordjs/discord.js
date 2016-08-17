<template>
  <span class="param {{ param.optional ? 'optional' : '' }}">{{ param.name }}</span>
</template>
<script>
export default {
  props: ['param'],
};
</script>
<style scoped lang="scss">
  span {
    font-weight: 300;
    color: #555;
    font-size: 1rem;
  }

  .optional {
    color: #777;
    font-style: italic;
  }
</style>
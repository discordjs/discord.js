<template>
  <span class="badge">private</span>
</template>
<script>
export default {
  props: ['item'],
};
</script>
<style scoped lang="scss">
.badge {
  background: lighten(#9F21F3, 20%);
  color: white;
  padding: 4px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  cursor: pointer;
}
</style>
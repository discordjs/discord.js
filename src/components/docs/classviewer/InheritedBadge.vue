<template>
  <span class="badge" v-link="{ name:'classview', params:{class:item.inherits.split('#')[0]}, query:{scrollto:item.inherits.split('#')[1]} }">inherited</span>
</template>
<script>
export default {
  props: ['item'],
};
</script>
<style scoped lang="scss">
.badge {
  background: lighten(#2196F3, 20%);
  color: white;
  padding: 4px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  text-transform: uppercase;
  font-size: 14px;
  cursor: pointer;
}

.badge:hover {
  background: #2196F3;
}
</style>
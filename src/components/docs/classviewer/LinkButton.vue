<template>
  <i class="fa fa-link" v-link='{ name:"classview", query:{scrollto:item.name} }'></i>
</template>
<script>
export default {
  props: ['item'],
};
</script>
<style lang="scss">
  i {
    text-decoration: none;
    color: #eee;
    cursor: pointer;
  }
  i:hover {
    color: #333;
  }
</style>
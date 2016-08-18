<template>
  <i class="fa fa-link" v-link='{ name:"classview", query:{scrollto:item.name} }'></i>
</template>
<script>
export default {
  props: ['item'],
};
</script>
<style scoped lang="scss">
  i {
    text-decoration: none;
    color: #eee;
    cursor: pointer;
  }
  i:hover {
    color: #333;
  }
  .scrolled i{
    color: #777;
  }
  .scrolled i:hover {
    color: black;
  }
</style>
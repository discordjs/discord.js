<template>
  <div class='docs-sidebar'>
    <i class="fa fa-user-secret toggle" @click="$dispatch('toggleShowPrivate')"></i>
    <ul v-for="(category, items) in docs.custom">
      <li>{{ category }}</li>
      <li v-for="(name, data) in items" v-link='{ name: "fileview", params: { category:category, file:name } }'>{{ name }}</li>
    </ul>
    <ul>
      <li>Type Definitions</li>
      <li v-for="(item, data) in docs.json.typedefs" v-link='{ name: "typedefview", params: { typedef:item } }'>{{ item }}</li>
    </ul>
    <ul>
      <li>Classes</li>
      <li v-for="(className, data) in docs.json.classes"
          v-link='{ name: "classview", params: { category:category, class:className } }'
          v-if="$parent.$parent.$parent.viewPrivate || data.meta.access !== 'private'"
          class="{{ data.meta.access==='private' ? 'private' : '' }}">{{ className }}
          <i class="fa fa-user-secret" v-if="data.meta.access==='private'"></i></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['docs'],
  data() {
    return {
      docLink: this.$route.path,
    };
  },
};
</script>
<style scoped lang="scss">
  .fa.toggle {
    color: #ccc;
    font-size: 22px;
    margin-left: 4px;
    cursor: pointer;
  }
  .fa.toggle:hover {
    color: #666;
  }
  ul .fa {
    color: #aaa;
  }
</style>
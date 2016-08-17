<template>
  <div class='docs-sidebar'>
    <ul v-for="(category, items) in docs.custom">
      <li>{{ category }}</li>
      <li v-for="(name, data) in items" v-link='{ name: "fileview", params: { category:category, file:name } }'>{{ name }}</li>
    </ul>
    <ul>
      <li>Classes</li>
      <li v-for="(className, data) in docs.json.classes" v-link='{ name: "classview", params: { category:category, class:className } }'>{{ className }}</li>
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
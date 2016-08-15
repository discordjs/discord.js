<template>
  <div class='docs-sidebar'>
    <ul v-for="(category, items) in docs.custom">
      <li>{{ category }}</li>
      <li v-for="(name, data) in items" v-link='{ name: "fileview", params: { category:category, file:name } }'>{{ name }}</li>
    </ul>
    <ul>
      <li>Classes</li>
      <li v-for="piece in docs.json" v-if="piece.kind=='class'">{{ piece.name }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['docs'],
  data() {
    console.log(this.$route.path);
    return {
      docLink: this.$route.path,
    };
  },
};
</script>
<template>
  <div class="hello">
    <component :is="currentView"></component>
  </div>
</template>

<script>
const markdown = require('marked');
const Vue = require('vue');
console.log(markdown('Hello *World*!<a>asd</a>'));

export default {
  data() {
    const params = this.$route.params;
    const data = this.$root.store.currentDocs.custom[params.category][params.file];
    const html = Vue.extend({
      template: markdown(data),
    });
    Vue.component('temp', html);
    return {
      currentView: 'temp',
      data,
      html,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>

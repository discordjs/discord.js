<template>
  <div class="doc-part-view">
    <container>
      <h1>Class: {{ info.meta.name }}</h1>
      <p>{{{ info.meta.description | marked }}}</p>
      <hr>
      <overview :info="info"></overview>
      <hr>
      <h2>Properties:</h2>
      <prop-renderer v-for="prop in info.properties" :prop="prop"></prop-renderer>
    </container>
  </div>
</template>
<script>
import overview from './DocsOverview.vue';
import propRenderer from './DocsPropRenderer.vue';

export default {
  components: {
    overview,
    propRenderer,
  },
  data() {
    const params = this.$route.params;
    return {
      info: this.$parent.$parent.docs.json.classes[params.class],
    };
  },
  ready() {
    for (const item of this.$el.querySelectorAll('pre code')) {
      window.hljs.highlightBlock(item);
    }
  },
};
</script>
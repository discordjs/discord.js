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
      <hr>
      <h2>Methods:</h2>
      <method-renderer v-for="method in info.functions" :method="method"></method-renderer>
    </container>
  </div>
</template>
<script>
import overview from './DocsOverview.vue';
import propRenderer from './DocsPropRenderer.vue';
import methodRenderer from './DocsMethodRenderer.vue';

export default {
  components: {
    overview,
    propRenderer,
    methodRenderer,
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
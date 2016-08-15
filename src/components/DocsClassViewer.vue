<template>
  <div class="doc-part-view">
    <container>
      <h1>Class: {{ info.meta.name }}</h1>
      <p>{{{ info.meta.description | marked }}}</p>
      <overview :info="info"></overview>
    </container>
  </div>
</template>
<script>
import overview from './DocsOverview.vue';

export default {
  components: {
    overview,
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
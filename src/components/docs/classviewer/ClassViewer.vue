<template>
  <div class="doc-part-view">
    <container>
      <h1>Class: {{ info.meta.name }}</h1>
      <p>{{{ info.meta.description | normalise | marked }}}</p>
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
import overview from './Overview.vue';
import propRenderer from './PropRenderer.vue';
import methodRenderer from './MethodRenderer.vue';

function gqp(qs) {
  qs = qs.split('+').join(' ');
  const params = {};
  let tokens;
  const re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

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
  methods: {
    scroll(item) {
      const url = window.location.href.split('?')[0];
      window.location.href = `${url}?scrollto=${encodeURIComponent(item)}`;
    },
  },
  ready() {
    for (const item of this.$el.querySelectorAll('pre code')) {
      window.hljs.highlightBlock(item);
    }
    let params = window.location.href.split('?')[1];
    if (params) {
      params = gqp(params);
      if (params.scrollto) {
        document.getElementById(`doc_for_${params.scrollto}`).scrollIntoView(true);
      }
    }
  },
};
</script>
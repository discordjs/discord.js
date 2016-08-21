<template>
    <span class="classViewer">
      <span class="title"> {{* jsclass.name }}<span class="extendDetails" v-if="jsclass.extends">
          extends {{* jsclass.extends }}
        </span>
      </span>
      <p class="classdesc">{{{* jsclass.description | normalise | marked }}}</p>
      <overview :jsclass="jsclass"></overview>
      <span class="title">Properties</span>
      <prop-renderer v-for="prop in jsclass.properties" :prop="prop"></prop-renderer>
    </span>
</template>
<script>
import Overview from './Overview.vue';
import PropRenderer from './PropRenderer.vue';

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
    Overview,
    PropRenderer,
  },
  props: ['docs'],
  data() {
    const params = this.$route.params;
    for (const jsclass of this.docs.classes) {
      if (jsclass.name === params.class) {
        return {
          jsclass,
        };
      }
    }
    return {};
  },
  route: {
    canReuse() {
      return false;
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
        const elem = document.getElementById(`doc_for_${params.scrollto}`);
        elem.scrollIntoView(true);
      }
    }
  },
};
</script>
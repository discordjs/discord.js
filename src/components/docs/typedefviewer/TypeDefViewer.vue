<template>
    <span class="typeDefViewer">
      <span class="title">
        {{* typedef.name }}
      </span>
      <p class="typeDefDesc">{{{* typedef.description | normalise | marked }}}</p>
      <b class="typeDefType">Types:</b>
      <ul>
        <li v-for="type in typedef.type.types"><type-renderer :names="type"></type-renderer></li>
      </ul>
    </span>
</template>
<script>
import TypeRenderer from '../classviewer/TypeRenderer.vue';

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
  props: ['docs'],
  components: {
    TypeRenderer,
  },
  data() {
    const params = this.$route.params;
    for (const typedef of this.docs.typedefs) {
      if (typedef.name === params.typedef) {
        return {
          typedef,
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
        elem.setAttribute('data-selected', true);
        setTimeout(() => elem.removeAttribute('data-selected'), 1);
        elem.scrollIntoView(true);
        window.scrollBy(0, -100);
      }
    }
  },
};
</script>
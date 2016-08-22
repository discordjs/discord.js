<template>
  <div class="fileViewer">
  {{{* file.data | normalise | marked }}}
  </div>
</template>
<script>

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
  data() {
    const params = this.$route.params;
    for (const file of this.docs.custom[params.category]) {
      if (file.name === params.file) {
        return {
          file,
        };
      }
    }
    return {};
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
  route: {
    canReuse() {
      return false;
    },
  },
};
</script>
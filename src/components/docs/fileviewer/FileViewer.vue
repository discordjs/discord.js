<template>
  <div class="doc-part-view">
    <container>
      {{{ file | marked }}}
    </container>
  </div>
</template>
<script>
export default {
  data() {
    const params = this.$route.params;
    return {
      file: this.$parent.$parent.docs.custom[params.category][params.file],
    };
  },
  ready() {
    for (const item of this.$el.querySelectorAll('pre code')) {
      window.hljs.highlightBlock(item);
    }
  },
  route: {
    canReuse() {
      return false;
    },
  },
};
</script>
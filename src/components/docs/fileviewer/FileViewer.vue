<template>
  <div class="fileViewer">
  {{{* file.data | normalise | marked }}}
  </div>
</template>
<script>
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
};
</script>
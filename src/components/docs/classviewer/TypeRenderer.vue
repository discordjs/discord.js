<template><span class="type"><single-type-renderer v-for="type in names" :type="type"></single-type-renderer></span></template>
<script>
import SingleTypeRenderer from './SingleTypeRenderer.vue';

export default {
  components: {
    SingleTypeRenderer,
  },
  props: ['names'],
};
</script>
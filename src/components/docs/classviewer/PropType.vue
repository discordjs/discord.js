<template><var-type-render v-for="type in types" :data="type"></var-type-render></template>
<script>
import VarTypeRender from './VarTypeRender.vue';
export default {
  components: {
    VarTypeRender,
  },
  props: ['types'],
};
</script>
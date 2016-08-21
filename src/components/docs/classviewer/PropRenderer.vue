<template>
  <div class="classProp">
    <div class="propName">.{{* prop.name }}</div>
    <div class="propDescription">{{{* prop.description | normalise | marked }}}</div>
    <div class="propType"><b>Type:</b> <type-renderer v-for="type in prop.type.types" :names="type"></type-renderer></div>
  </div>
</template>
<script>
import TypeRenderer from './TypeRenderer.vue';
export default {
  components: {
    TypeRenderer,
  },
  props: ['prop'],
};
</script>
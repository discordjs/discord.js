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
};
</script>
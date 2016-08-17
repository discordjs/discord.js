<template>
  <container>
    <h3 id="doc_for_{{ prop.name }}">.{{ prop.name }} <source-button :meta="prop.meta"></source-button>
    <link-button :item="prop"></link-button></h3>
    <div class="desc">
    <p>{{{ prop.description | marked }}}</p>
    <p><b>Type:</b> <prop-type :types="prop.type"></prop-type></p>
    </div>
  </container>
</template>
<script>
import PropType from './PropType.vue';
import SourceButton from './SourceButton.vue';
import LinkButton from './LinkButton.vue';
export default {
  props: ['prop'],
  components: {
    PropType,
    SourceButton,
    LinkButton,
  },
  data() {
    return {
    };
  },
};
</script>
<style scoped lang="scss">
  .desc {
    border-left: 3px solid #ddd;
    padding: 0 1rem;
    color: #555;
  }

  h3 {
    font-family: 'Roboto Mono';
    font-weight: 500;
  }
</style>
  
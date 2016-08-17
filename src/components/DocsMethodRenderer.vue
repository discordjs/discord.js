<template>
  <container>
    <h3 id="{{ method.name }}">.{{ method.name }}(<param v-for="param in method.params" :param="param"></param>)</h3>
    <div class="desc">
    <p>{{{ method.description | marked }}}</p>
    <p><b>Returns:</b> <prop-type :types="method.returns[0]"></prop-type></p>
    </div>
  </container>
</template>
<script>
import PropType from './DocsPropType.vue';
import Param from './DocsParam.vue';
export default {
  props: ['method'],
  components: {
    PropType,
    Param,
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

  .param.optional:before {
    content: "[";
  }

  .param.optional:after {
    content: "]";
  }

  .param:not(:last-child):after {
    content: ", ";
  }
</style>
  
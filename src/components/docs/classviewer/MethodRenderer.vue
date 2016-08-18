<template>
  <container class="{{ $route.query.scrollto === method.name ? 'scrolled' : '' }}"> 
    <h3 id="doc_for_{{ method.name }}">.{{ method.name }}(<span><param v-for="param in method.params" :param="param"></param></span>)
    <inherited-badge v-if="method.inherited" :item="method"></inherited-badge>
    <source-button :meta="method.meta"></source-button>
    <link-button :item="method"></link-button>
    </h3>
    <div class="desc">
      <param-table :params="method.params" v-if="method.params.length>0"></param-table>
      <p>{{{ method.description | normalise | marked }}}</p>
      <p><b>Returns:</b> {{ method.returns[0].type.names[0] }}</p>
      <p v-if="method.examples"><b>Examples:</b><example v-for="example in method.examples" :example=example></example></p>
    </div>
  </container>
</template>
<script>
import PropType from './PropType.vue';
import Param from './Param.vue';
import ParamTable from './ParamTable.vue';
import Example from './Example.vue';
import SourceButton from './SourceButton.vue';
import LinkButton from './LinkButton.vue';
import InheritedBadge from './InheritedBadge.vue';
export default {
  props: ['method'],
  components: {
    PropType,
    Param,
    ParamTable,
    Example,
    SourceButton,
    LinkButton,
    InheritedBadge,
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
  
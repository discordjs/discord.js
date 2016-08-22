<template>
  <div class="classMethod" id="doc_for_{{* method.name }}">
    <div class="methodName" v-link='{ name:"classview", query:{scrollto:method.name}}'>.{{* method.name }}(<span v-for="param in method.params" class="param {{* param.optional ? 'optional' : '' }}">{{* param.name }}</span>)</div>
    <div class="methodDescription">{{{* method.description | normalise | marked }}}</div>
    <param-table v-if="method.params.length > 0" :params="method.params"></param-table>
    <div class="methodReturn">Returns: <type-renderer v-for="return in method.returns.types" :names="return"></type-renderer></div>
    <div v-if="method.examples && method.examples.length > 0" class="methodExamples">
      <b>Examples:</b>
      <div v-for="example in method.examples" class="example">{{{* '```js\n'+example+'```' | marked }}}</div>
    </div>
  </div>
</template>
<script>
import TypeRenderer from './TypeRenderer.vue';
import ParamTable from './ParamTable.vue';
export default {
  components: {
    TypeRenderer,
    ParamTable,
  },
  props: ['method'],
};
</script>
<template>
  <div class="classProp" id="doc_for_{{* prop.name }}">
    <div class="propName" v-link='{ name:"classview", query:{scrollto:prop.name}}'>.{{* prop.name }}</div>
    <div class="propDescription">{{{* prop.description | normalise | marked }}}</div>
    <param-table :params="prop.props" v-if="prop.props.length > 0"></param-table>
    <div class="propType"><b>Type:</b> <type-renderer v-for="type in prop.type.types" :names="type"></type-renderer></div>
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
  props: ['prop'],
};
</script>
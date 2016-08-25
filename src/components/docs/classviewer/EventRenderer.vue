<template>
  <div class="classEvent" id="doc_for_{{* event.name }}">
    <div class="eventName" v-link='{ name:"classview", query:{scrollto:event.name}}'>.{{* event.name }}</div>
    <p class="eventDescription">{{{* event.description | normalise | marked }}}</p>
    <pre class="eventUsage"><code class="lang-js">{{* event.memberof | camel }}.on('{{* event.name }}', ({{* event.params | joinParams }}) => {<br/>&nbsp;&nbsp;//do stuff<br />});</code></pre>
    <param-table v-if="event.params.length > 0" :params="event.params"></param-table>
  </div>
</template>
<script>
import TypeRenderer from './TypeRenderer.vue';
import ParamTable from './ParamTableNoOptional.vue';
export default {
  components: {
    TypeRenderer,
    ParamTable,
  },
  props: ['event'],
};
</script>
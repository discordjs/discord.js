<template>
<div class="docs-class-overview">
  <div class="docs-class-overview-segment">
    <h4>Properties</h4>
    <ul>
      <li v-for="prop in info.properties" v-link='{ name:"classview", query:{scrollto:prop.name} }'><span class="propName {{ prop.inherited ? 'inherited' : '' }}">.{{ prop.name }}</span> =>
      <span class="type"><prop-type :types="prop.type"></prop-type></span></li>
    </ul>
  </div>
  <div class="docs-class-overview-segment">
    <h4>Methods</h4>
    <ul>
      <li v-for="method in info.functions" v-link='{ name:"classview", query:{scrollto:method.name} }'><span class="propName {{ method.inherited ? 'inherited' : '' }}" v-if="method">.{{ method.name }}</span></li>
    </ul>
  </div>
</template>
<script>
import PropType from './PropType.vue';

export default {
  components: {
    PropType,
  },
  props: ['info'],
};
</script>
<style lang="scss">
.docs-class-overview {

  display: inline-block;

  h4 {
    margin: 0.2rem 0;
  }

  ul {
    margin: 0;
    font-size: 14px;
    color: #333;

    li {
      cursor: pointer;
    }

    .inherited {
      color: #777;
      font-size: 13px;
    }

    .type {
      color: #2196F3;
      font-family: 'Roboto Mono', monospace;
      font-weight: bold;
    }

    li:hover {
      text-decoration: underline;
    }
  }

  .docs-class-overview-segment {
    flex: 1;
  }
}
</style>
<template>
<div class="docs-class-overview">
  <div class="docs-class-overview-segment">
    <h2>Properties</h2>
    <ul>
      <li v-for="prop in info.properties"><span class="propName">.{{ prop.name }}</span> ->
      <span class="type">{{ prop.type.names[0] }}</span></li>
    </ul>
  </div>
  <div class="docs-class-overview-segment">
    <h2>Functions</h2>
    <ul>
      <li v-for="prop in info.functions">{{ prop.name }}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['info'],
};
</script>
<style lang="scss">
.docs-class-overview {

  ul {
    margin: 0;
    font-size: 0.9rem;
    color: #555;

    .propName {
      color: black;
    }

    .type {
      color: #2196F3;
      font-family: 'Roboto Mono', monospace;
      font-weight: bold;
    }

    li {
      cursor: pointer;
    }

    li:hover {
    }
  }

  .docs-class-overview-segment {
    flex: 1;
  }
}
</style>
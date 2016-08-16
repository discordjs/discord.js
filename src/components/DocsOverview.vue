<template>
<div class="docs-class-overview">
  <div class="docs-class-overview-segment">
    <h4>Properties</h4>
    <ul>
      <li v-for="prop in info.properties"><span class="propName">.{{ prop.name }}</span> =>
      <span class="type">{{ prop.type.names[0] }}</span></li>
    </ul>
  </div>
  <div class="docs-class-overview-segment">
    <h4>Functions</h4>
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

  display: inline-block;

  h4 {
    margin: 0.2rem 0;
  }

  ul {
    margin: 0;
    font-size: 14px;
    color: #555;

    .propName {
      color: black;
      cursor: pointer;
    }

    .type {
      color: #2196F3;
      font-family: 'Roboto Mono', monospace;
      font-weight: bold;
    }

    .propName:hover {
      text-decoration: underline;
    }
  }

  .docs-class-overview-segment {
    flex: 1;
  }
}
</style>
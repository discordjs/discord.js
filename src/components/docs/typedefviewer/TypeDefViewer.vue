<template>
  <div class="doc-part-view">
    <container>
      <h1>TypeDef: {{ typedef.name }}</h1>
      <hr>
      <p>{{{ typedef.description | normalise | marked }}}</p>
      <hr>
      <p>
        <b>Types: </b>
        <ul>
          <li v-for="name in typedef.type.names">
            <var-type-render :data="[name, '']" class="var-a"></var-type-render>
          </li>
        </ul>
      </p>
    </container>
  </div>
</template>
<script>
import VarTypeRender from '../classviewer/VarTypeRender.vue';
export default {
  components: {
    VarTypeRender,
  },
  data() {
    const params = this.$route.params;
    return {
      typedef: this.$parent.$parent.docs.json.typedefs[params.typedef],
    };
  },
};
</script>
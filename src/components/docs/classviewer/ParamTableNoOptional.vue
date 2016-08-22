<template>
  <div class="paramTableWrapper">
    <table class="paramTable">
      <tbody>
        <tr>
          <th>Parameter</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
        <tr v-for="param in params">
          <td>{{* param.name }}</td>
          <td><type-renderer v-for="type in param.type.types" :names="type"></type-renderer></td>
          <td>{{{* param.description | normalise | marked }}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import TypeRenderer from './TypeRenderer.vue';

export default {
  components: {
    TypeRenderer,
  },
  props: ['params'],
};
</script>
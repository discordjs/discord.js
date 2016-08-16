<template>
  <container>
    <h3 id="{{ prop.name }}">.{{ prop.name }}</h3>
    <div class="desc">
    <p>{{{ prop.description | marked }}}</p>
    <p><b>Type:</b> {{ prop.type.names[0] }}</p>
    </div>
  </container>
</template>
<script>
export default {
  props: ['prop'],
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
</style>
  
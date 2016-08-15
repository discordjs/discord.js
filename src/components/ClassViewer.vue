<template>
  <div class="hello">
    <h1>{{ $route.params.id }}</h1>
    <p>{{ meta.description }}</p>
  </div>
</template>

<script>
export default {
  data() {
    const params = this.$route.params;
    const classMeta = this.$root.store.currentDocs.json.filter(item =>
      item.kind === 'class' && item.name === params.id
    )[0];
    console.log(classMeta);
    return {
      store: this.$root.store,
      name: params.id,
      meta: classMeta,
    };
  },
};
</script>
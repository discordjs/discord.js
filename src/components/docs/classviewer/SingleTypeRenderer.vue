<template><span @click="$root.resolveReference(type[0])"" class="typeLink">{{* type[0] }}</span><span class="typeRest">{{* type[1] }}</span></template>
<script>
export default {
  props: ['type'],
};
</script>
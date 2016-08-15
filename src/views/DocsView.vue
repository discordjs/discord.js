<template>
  <docs-bar></docs-bar>
  <router-view></router-view>
</template>
<script>
const branchData = {};

export default {
  data() {
    return {
      branchData,
    };
  },
};
</script>

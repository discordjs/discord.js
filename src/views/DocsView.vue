<template>
  <div class="docs-view">
    <div class="docs-topbar">
      <div class="container">
        Documentation
      </div>
    </div>
    <div class="docs-page">
      <div class="container">
        <ul class="docs-sidebar">
          <li class="category">General</li>
          <li class="link">Getting Started</li>
          <li class="link">Installation</li>
          <li class="category">Classes</li>
          <li class="link">User</li>
          <li class="link">Guild</li>
        </ul>
        <div class="docs-content">
          <h1>Getting Started...</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      store: this.$root.store,
    };
  },
};
</script>
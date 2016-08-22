<template>
  <div class='docs-sidebar'>
    <div class='mob-button' @click="toggle"><i class="fa fa-bars"></i></div>
    <div class='content {{ sidebarVisible ? "on" : "off" }}'>
      <div class="mob-back" @click="toggle">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
      <ul>
        <li>Classes</li>
        <li v-for="docclass in docs.classes" v-link='{ name:"classview", params:{class:docclass.name} }' @click="toggle">{{ docclass.name }}</li>
      </ul>
      <ul>
        <li>TypeDefs</li>
        <li v-for="typedef in docs.typedefs" v-link='{ name:"typedefview", params:{typedef:typedef.name} }'>{{ typedef.name }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['docs'],
  data() {
    return {
      sidebarVisible: false,
    };
  },
  methods: {
    toggle() {
      this.sidebarVisible = !this.sidebarVisible;
    },
  },
};
</script>
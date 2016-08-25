<template>
  <div class='docs-sidebar'>
    <div class='mob-button' @click="toggle"><i class="fa fa-bars"></i></div>
    <div class='content {{ sidebarVisible ? "on" : "off" }}'>
      <div class="mob-back" @click="toggle">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
      </div>
      <ul v-for="(category, catFiles) in docs.custom">
        <li>{{ category }}</li>
        <li v-for="file in catFiles" v-link='{ name:"fileview", params:{category:category, file:file.name} }' @click="toggle">{{ file.name }}</li>
      </ul>
      <ul>
        <li>Classes</li>
        <li v-for="docclass in docs.classes" v-link='{ name:"classview", params:{class:docclass.name} }' @click="toggle">{{ docclass.name }}</li>
      </ul>
      <ul>
        <li>TypeDefs</li>
        <li v-for="typedef in docs.typedefs" v-link='{ name:"typedefview", params:{typedef:typedef.name} }' @click="toggle">{{ typedef.name }}</li>
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
  route: {
    canReuse() {
      return false;
    },
  },
};
</script>
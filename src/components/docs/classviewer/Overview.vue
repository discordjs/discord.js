<template>
  <div class="classOverview">
    <div class="col" v-if="jsclass.properties.length > 0">
      <span class="title">Properties</span>
      <ul>
        <li v-for="property in jsclass.properties" v-link='{ name:"classview", query:{scrollto:property.name}}'>{{ property.name }}</li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.methods.length > 0">
      <span class="title">Methods</span>
      <ul>
        <li v-for="method in jsclass.methods" v-link='{ name:"classview", query:{scrollto:method.name}}'>{{ method.name }}</li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.events.length > 0">
      <span class="title">Events</span>
      <ul>
        <li v-for="event in jsclass.events" v-link='{ name:"classview", query:{scrollto:event.name}}'>{{ event.name }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['jsclass'],
};
</script>
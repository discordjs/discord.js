<template>
  <div class="classOverview">
    <div class="col" v-if="jsclass.properties.length > 0">
      <span class="title">Properties</span>
      <ul>
        <li v-for="property in jsclass.properties">{{ property.name }}</li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.methods.length > 0">
      <span class="title">Methods</span>
      <ul>
        <li v-for="method in jsclass.methods">{{ method.name }}</li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.events.length > 0">
      <span class="title">Events</span>
      <ul>
        <li v-for="event in jsclass.events">{{ event.name }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['jsclass'],
};
</script>
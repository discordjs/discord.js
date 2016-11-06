<template>
  <div class="classOverview">
    <div class="col" v-if="jsclass.properties.length > 0">
      <span class="title">Properties</span>
      <ul>
        <li v-for="property in jsclass.properties" @click='scroll(property.name)'>{{ property.name }}</li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.methods.length > 0">
      <span class="title">Methods</span>
      <ul>
        <li v-for="method in jsclass.methods" @click='scroll(method.name)'>{{ method.name }}</li>
      </ul>
    </div>
    <div class="col" v-if="jsclass.events.length > 0">
      <span class="title">Events</span>
      <ul>
        <li v-for="event in jsclass.events" @click='scroll(event.name)'>{{ event.name }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['jsclass'],
  methods: {
    scroll(to) {
      this.$router.go({ name: 'classview', query: { scrollto: to } });

      const elem = document.getElementById(`doc_for_${to}`);
      elem.setAttribute('data-selected', true);
      setTimeout(() => elem.removeAttribute('data-selected'), 1);
      elem.scrollIntoView(true);
      window.scrollBy(0, -100);
    },
  },
  route: {
    canReuse() {
      return false;
    },
  },
};
</script>

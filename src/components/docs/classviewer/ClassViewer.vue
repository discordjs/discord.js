<template>
    <span class="classViewer">
      <span class="title"> {{* jsclass.name }}<span class="extendDetails" v-if="jsclass.extends">
          extends {{* jsclass.extends }}
        </span>
      </span>
      <p class="classdesc">{{{* jsclass.description | normalise | marked }}}</p>
      <div class="classConstructor" v-if="jsclass.classConstructor">
        <span class="title">Constructor</span>
        <div class="classConstructor">
          <pre>
            <code class="lang-js">new Discord.{{{* jsclass.name }}}(<span class="constructorParam" v-for="param in jsclass.classConstructor.params">{{* param.name }}</span>);</code>
          </pre>
          <param-table :params="jsclass.classConstructor.params"></param-table>
        </div>
      </div>
      <overview :jsclass="jsclass"></overview>
      <span class="title" v-if="jsclass.properties.length > 0">Properties</span>
      <prop-renderer v-for="prop in jsclass.properties" :prop="prop"></prop-renderer>
      <span class="title" v-if="jsclass.methods.length > 0">Methods</span>
      <method-renderer v-for="method in jsclass.methods" :method="method"></method-renderer>
      <span class="title" v-if="jsclass.events.length > 0">Events</span>
      <event-renderer v-for="event in jsclass.events" :event="event"></event-renderer>
    </span>
</template>
<script>
import Overview from './Overview.vue';
import PropRenderer from './PropRenderer.vue';
import MethodRenderer from './MethodRenderer.vue';
import EventRenderer from './EventRenderer.vue';
import ParamTable from './ParamTable.vue';

function gqp(qs) {
  qs = qs.split('+').join(' ');
  const params = {};
  let tokens;
  const re = /[?&]?([^=]+)=([^&]*)/g;
  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}

export default {
  components: {
    Overview,
    PropRenderer,
    MethodRenderer,
    EventRenderer,
    ParamTable,
  },
  props: ['docs'],
  data() {
    const params = this.$route.params;
    for (const jsclass of this.docs.classes) {
      if (jsclass.name === params.class) {
        return {
          jsclass,
        };
      }
    }
    return {};
  },
  route: {
    canReuse() {
      return false;
    },
  },
  ready() {
    for (const item of this.$el.querySelectorAll('pre code')) {
      window.hljs.highlightBlock(item);
    }
    let params = window.location.href.split('?')[1];
    if (params) {
      params = gqp(params);
      if (params.scrollto) {
        const elem = document.getElementById(`doc_for_${params.scrollto}`);
        elem.setAttribute('data-selected', true);
        setTimeout(() => elem.removeAttribute('data-selected'), 1);
        elem.scrollIntoView(true);
        window.scrollBy(0, -100);
      }
    }
  },
};
</script>
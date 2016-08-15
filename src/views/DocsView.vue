<template>
  <div class="docs-view">
    <div class="loading" v-if="store.loading">Loading...</div>
    <div class="docs-topbar">
      <div class="container">
        <span class="heading">Documentation</span>
        <div class="options">
          <div v-on:click="chooseOption('branch')" class="option {{ options.branch ? 'selected' : '' }}">branch</div>
          <div v-on:click="chooseOption('release')" class="option {{ options.release ? 'selected' : '' }}">release</div>
          <div v-on:click="chooseOption('commit')" class="option {{ options.commit ? 'selected' : '' }}">commit</div>
        </div>
        <select v-if="options.branch" v-model="selectedBranch">
          <option v-for="branch in store.branches" v-bind:value="branch.name">{{ branch.name }}</option>
        </select>
      </div>
    </div>
    <div class="docs-page">
      <div class="container">
        <ul class="docs-sidebar">
          <ul class="category" v-for="(category, items) in store.currentDocs.custom">
            <li>{{ category }}</li>
            <li class="link" v-for="(name, data) in items" v-link='{ path:"/docs/file/"+category+"/"+name }'>
              {{ name }}
            </li>
          </ul>
          <ul class="category">
            <li>Classes</li>
            <li class="link" v-for="piece in store.currentDocs.json" v-if="piece.kind=='class'"  v-link='{ path:"/docs/class/"+piece.name }'>
              {{ piece.name }}
            </li>
          </ul>
        </ul>
        <div class="docs-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

const options = {
  branch: true,
  commit: false,
  release: false,
};

let store = {};

function loadDocs(name) {
  return new Promise((resolve, reject) => {
    if (!name) {
      return reject(new Error('no name'));
    }
    if (store.branches[name]) {
      store.currentDocs = store.branches[name];
      return resolve(store.branches[name]);
    }
    store.loading = true;
    $.getJSON(`https://raw.githubusercontent.com/hydrabolt/discord.js/${name}/docs/docs.json`, data => {
      if (data) {
        store.branches[name] = data;
        store.currentDocs = data;
        store.loading = false;
        return resolve(data);
      }
      store.loading = false;
      return alert(`Couldn't find documentation for ${name}`);
    })
    .fail(error => {
      store.loading = false;
      return alert(`Couldn't find documentation for ${name} - ${error.responseText}`);
    });
    return null;
  });
}

export default {
  data() {
    store = this.$root.store;
    return {
      store: this.$root.store,
      options,
      selectedBranch: null,
    };
  },
  methods: {
    chooseOption: option => {
      for (const opt in options) {
        options[opt] = option === opt;
      }
    },
  },
  watch: {
    selectedBranch: (val) => {
      loadDocs(val);
    },
  },
  computed: {
    categories() {
      return Object.keys(store.currentDocs.custom);
    },
  },
};
</script>
<template>
  <div class="docs-navbar">
    <container>
      <div class="choices">
        Select docs from
        <span class="choice" @click='select("tag")'>Release</span> or
        <span class="choice" @click='select("branch")'>Branch</span>
      </div>
      <div class="branchSelect" v-if="choice=='tag'">
        <select v-model="chosenTag">
          <option v-for="tag in $root.store.tags" v-bind:value="tag.name" :selected="tag.name==($route.params.tag || $root.store.latestTag)">{{ tag.name }}</option>
        </select>
      </div>
      <div class="branchSelect" v-if="choice=='branch'">
        <select v-model="chosenTag">
          <option v-for="branch in $root.store.branches" v-bind:value="branch.name" :selected="branch.name==($route.params.tag || 'master')">{{ branch.name }}</option>
        </select>
      </div>
    </container>
  </div>
</template>
<script>
import semver from 'semver';

export default {
  data() {
    if (!this.$route.params.tag) this.$router.go({ path: '/docs/tag/master' });
    return {
      choice: semver.valid(this.$route.params.tag) ? 'tag' : 'branch',
      chosenTag: this.$route.params.tag ? this.$route.params.tag : 'master',
    };
  },
  methods: {
    select(item) {
      this.choice = item;
    },
  },
  watch: {
    chosenTag(val) {
      if (val) this.$router.go({ path: `/docs/tag/${val}` });
    },
  },
};
</script>

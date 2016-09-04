<template>
  <div class="docs-navbar">
    <container>
      <div class="choices">
        Select docs from 
        <span class="choice" @click='select("branch")'>Branch</span> or
        <span class="choice" @click='select("commit")'>Commit</span> or
        <span class="choice" @click='select("release")'>Release</span>
      </div>
      <div class="branchSelect" v-if="choice=='branch'">
        <select v-model="chosenTag">
          <option selected value>Select a Branch</option>
          <option v-for="branch in $root.store.branches" v-bind:value="branch.name" :selected="branch.name=='master'">{{ branch.name }}</option>
        </select>
      </div>
    </container>
  </div>
</template>
<script>

export default {
  data() {
    if (!this.$route.params.tag) {
      this.$router.go({ path: '/docs/tag/master' });
    }
    return {
      choice: this.$route.params.tag ? null : 'branch',
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
      if (val) {
        this.$router.go({ path: '/docs/' });
        this.$router.go({ path: `/docs/tag/${val}` });
      }
    },
  },
};
</script>
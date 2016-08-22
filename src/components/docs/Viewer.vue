<template v-if="docs">
  <div class="docs-viewer">
    <container>
      <sidebar :docs="docs"></sidebar>
      <router-view :docs="docs"></router-view>
    </container>
  </div>
</template>
<script>
import store from '../../store';
import Sidebar from './Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      docs: store.data.docs[this.$route.params.tag],
      viewPrivate: this.$route.query.private,
    };
  },
  ready() {
    this.$router.go({
      name: 'fileview',
      params: {
        category: 'general',
        file: 'Getting Started',
      },
    });
  },
  route: {
    canActivate(transition) {
      store.fetchDocs(transition.to.params.tag).then(() => {
        transition.next();
      }).catch(e => {
        transition.abort();
        alert(`Couldn't load docs for ${transition.to.params.tag} - ${e}`);
        console.log(e);
      });
    },
  },
  events: {
    toggleShowPrivate() {
      this.viewPrivate = !this.viewPrivate;
    },
  },
};
</script>
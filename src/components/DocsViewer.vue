<template v-if="docs">
  <div class="docs-viewer">
    <container>
      <sidebar :docs="docs"></sidebar>
      <router-view></router-view>
    </container>
  </div>
</template>
<script>
import store from '../store';
import Sidebar from './DocsSidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      docs: store.data.docs[this.$route.params.tag],
    };
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
    canReuse() {
    },
  },
};
</script>
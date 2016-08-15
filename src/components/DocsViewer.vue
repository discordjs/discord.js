<template>
  <div class="docs-viewer">
    <container>
      Docs are version  {{ docs.meta.version }}
    </container>
  </div>
</template>
<script>
import store from '../store';

export default {
  data() {
    console.log(this.$route.params.tag, store.data.docs);
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
      });
    },
    canReuse(transition) {
      console.log('hook-example activated!', transition);
    },
  },
};
</script>
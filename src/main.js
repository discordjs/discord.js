import Vue from 'vue';
import VueRouter from 'vue-router';
import Views from './views/loader.js';
import Components from './components/loader.js';
import store from './store';
import marked from 'marked';

require('./styles/main.scss');

Vue.use(VueRouter);
Vue.component('app-navbar', Components.AppNavbar);
Vue.component('app-footer', Components.AppFooter);
Vue.component('container', Components.Container);
Vue.component('slide', Components.Slide);
Vue.component('github-star', Components.GitHubButton);
Vue.component('lib-stats', Components.Stats);
Vue.component('docs-bar', Components.DocsNavbar);

const App = Vue.extend({
  data() {
    return {
      sharedStore: store,
    };
  },
});

Vue.filter('marked', $text => {
  let text = $text || 'error! I\'m not set!';
  text = text.replace(/(<info>)/g, '<div class="info">');
  text = text.replace(/(<\/info>)/g, '</div>');
  text = text.replace(/(<warn>)/g, '<div class="warn">');
  text = text.replace(/(<\/warn>)/g, '</div>');
  return marked(text);
});

const router = new VueRouter();

router.map({
  '/': {
    component: Views.Index,
  },
  '/docs': {
    component: (resolve, reject) => {
      store.fetchBranches().then(() => {
        resolve(Views.Docs);
      }).catch(reject);
    },
    subRoutes: {
      '/tag/:tag': {
        component: Components.DocsViewer,
        name: 'docview',
        subRoutes: {
          '/file/:category/:file': {
            component: Components.FileViewer,
            name: 'fileview',
          },
          '/class/:class': {
            component: Components.ClassViewer,
            name: 'classview',
          },
        },
      },
    },
  },
});

router.start(App, '#vue-root');

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
      store: store.data,
    };
  },
  methods: {
    resolveReference(name) {
      const docs = this.store.docs[this.$route.params.tag];
      if (docs) {
        const path = docs.links[name];
        if (path === 'class') {
          this.$router.go({ name: 'classview', params: { class: name } });
        } else if (path === 'interface') {
          return;
        } else if (path === 'typedef') {
          this.$router.go({ name: 'typedefview', params: { typedef: name } });
        } else if (path) {
          window.location.href = path;
        }
      }
    },
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

Vue.filter('joinParams', params => {
  params = params || [];
  return params.map(param => param.name).join(', ');
  // events.map(event => event.name).join(', ');
});

Vue.filter('normalise', $text => {
  let text = ($text || 'error! I\'m not set!').trim();
  const firstChar = text.charAt(0);
  const lastChar = text.charAt(text.length - 1).toLowerCase();
  if (firstChar === firstChar.toLowerCase() && firstChar !== firstChar.toUpperCase()) {
    text = firstChar.toUpperCase() + text.substr(1);
  }
  if ('abcdefghijklmnopqrstuvwxyz'.indexOf(lastChar) >= 0) {
    text += '.';
  }
  return text;
});

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function c(letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

Vue.filter('camel', str => camelize(str));

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
          '/typedef/:typedef': {
            component: Components.TypeDefViewer,
            name: 'typedefview',
          },
        },
      },
    },
  },
});

router.beforeEach(transition => {
  window.scrollTo(0, 0);
  transition.next();
});

router.start(App, '#vue-root');

import Vue from 'vue';
import VueRouter from 'vue-router';
import IndexView from './views/IndexView';
import DocsView from './views/DocsView';
import FileViewer from './components/FileViewer';
import ClassViewer from './components/ClassViewer';
import Navbar from './components/Navbar';
import $ from 'jquery';

require('./style/main.scss');

Vue.use(VueRouter);

const store = {
  downloads: '50,000+ ',
  contributors: '30+ ',
  stars: '250+ ',
  currentDocs: null,
  branches: [],
  loading: true,
};

const App = Vue.extend({
  data() {
    return {
      store,
    };
  },
});
const router = new VueRouter();

let count = 0;
$.getJSON('https://api.npmjs.org/downloads/range/2013-08-21:2100-08-21/discord.js', data => {
  if (data) {
    for (const day of data.downloads) {
      count += day.downloads;
    }
    store.downloads = count;
  }
});

$.getJSON('https://api.github.com/repos/hydrabolt/discord.js/branches', data => {
  if (data) {
    store.branches = data;
    store.loading = false;
  }
});

$.getJSON('https://api.github.com/repos/hydrabolt/discord.js', data => {
  if (data) {
    store.stars = data.stargazers_count;
  }
});

$.getJSON('https://api.github.com/repos/hydrabolt/discord.js/contributors', data => {
  if (data) {
    store.contributors = data.length;
  }
});

Vue.component('navbar', Navbar);

router.map({
  '/': {
    component: IndexView,
  },
  '/docs': {
    component: DocsView,
    subRoutes: {
      '/file/:category/:file': {
        component: FileViewer,
      },
      '/class/:id': {
        component: ClassViewer,
      },
    },
  },
});

router.start(App, '#vue-root');

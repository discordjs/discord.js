import Vue from 'vue';
import VueRouter from 'vue-router';
import IndexView from './views/IndexView';
import DocsView from './views/DocsView';
import Navbar from './components/Navbar';
import $ from 'jquery';

require('./style/main.scss');

Vue.use(VueRouter);

const store = {
  downloads: '50,000+ ',
  contributors: '30+ ',
  stars: '250+ ',
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
  },
});

router.start(App, '#vue-root');

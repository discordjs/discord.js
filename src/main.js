import Vue from 'vue';
import VueRouter from 'vue-router';
import Views from './views/loader.js';
import Components from './components/loader.js';

require('./styles/main.scss');

Vue.use(VueRouter);
Vue.component('app-navbar', Components.AppNavbar);
Vue.component('app-footer', Components.AppFooter);
Vue.component('container', Components.Container);
Vue.component('slide', Components.Slide);
Vue.component('github-star', Components.GitHubButton);
Vue.component('lib-stats', Components.Stats);

const App = Vue.extend({});
const router = new VueRouter();

router.map({
  '/': {
    component: Views.Index,
  },
});

router.start(App, '#vue-root');

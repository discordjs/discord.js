import Vue from 'vue';
import VueRouter from 'vue-router';
import Views from './views/loader.js';
import Components from './components/loader.js';

require('./styles/main.scss');

Vue.use(VueRouter);
Vue.component('app-navbar', Components.Navbar);
Vue.component('container', Components.Container);
Vue.component('slide', Components.Slide);

const App = Vue.extend({});
const router = new VueRouter();

router.map({
  '/': {
    component: Views.Index,
  },
});

router.start(App, '#vue-root');

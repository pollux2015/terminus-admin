import 'iview/dist/styles/iview.css';

/**------------------------
 * Import Modules
 ------------------------*/
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';

import App from './app.vue';
import store from './libs/store';
import Util from './libs/util';
import Apis from './libs/apis';
import Rules from './libs/validate';

Vue.use(iView);
Vue.use(VueRouter);
Vue.use(Util);
Vue.use(Apis);
Vue.use(Rules);


/**------------------------
 * Import Style
 ------------------------*/
import 'iview/dist/styles/iview.css';


/**------------------------
 * Global Components
 ------------------------*/
import fileUpload from './components/file.upload';
Vue.component('fileUpload', fileUpload);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.setTitle(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
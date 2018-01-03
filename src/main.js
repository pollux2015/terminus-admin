import 'iview/dist/styles/iview.css';

/**------------------------
 * Import Modules
 ------------------------*/
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import { routers, otherRouter, appRouter } from './router';

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
    routes: routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    const toName = to.name;
    const needLogin = toName.search('error') == -1 && toName.search('login') == -1;
    iView.LoadingBar.start();

    if (needLogin) {
        store.dispatch('getMenus').then(code => {
            if (code == 1) {
                next();
            } else {
                iView.LoadingBar.error();
                router.replace({
                    name: 'login'
                });
                next();
            }
        })
    } else {
        next();
    }
});

router.onError((callback) => {
    console.log(222)
    router.replace({
        name: 'error_404'
    });
});

router.afterEach((to) => {
    const name = to.meta.title;
    store.commit('metaName', name);
    Util.setTitle(name);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
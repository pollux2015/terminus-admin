import Main from './views/basic/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/basic/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};


// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
    path: '/app',
    name: 'app',
    redirect: { name: 'home' },
    component: Main,
    children: [{
        path: 'home',
        meta: { title: '首页' },
        name: 'home',
        component: resolve => { require(['./views/index.vue'], resolve); }
    }, {
        path: 'company',
        meta: { title: '单位管理' },
        name: 'company',
        component: resolve => { require(['./views/company/company.vue'], resolve); }
    }, {
        path: 'face',
        meta: { title: '人脸管理' },
        name: 'face',
        component: resolve => { require(['./views/face/face.vue'], resolve); }
    }, {
        path: 'gate',
        meta: { title: '闸机管理' },
        name: 'gate',
        component: resolve => { require(['./views/gate/gate.vue'], resolve); }
    }, {
        path: 'log',
        meta: { title: '通行日志' },
        name: 'log',
        component: resolve => { require(['./views/log/log.vue'], resolve); }
    }, {
        path: 'sys',
        meta: { title: '系统管理' },
        name: 'sys',
        component: resolve => { require(['./views/sys/sys.vue'], resolve); }
    }]
}];

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'company/add', meta: { title: '新增单位' }, name: 'company.add', component: resolve => { require(['./views/company/edit.vue'], resolve); } },
        { path: 'company/edit/:id', meta: { title: '编辑单位' }, name: 'company.edit', component: resolve => { require(['./views/company/edit.vue'], resolve); } },
        { path: 'gate/add', meta: { title: '新增闸机' }, name: 'gate.add', component: resolve => { require(['./views/gate/gate.edit.vue'], resolve); } },
        { path: 'gate/edit/:id', meta: { title: '编辑闸机' }, name: 'gate.edit', component: resolve => { require(['./views/gate/gate.edit.vue'], resolve); } },
        { path: 'gategroup/add', meta: { title: '新增闸机组' }, name: 'gategroup.add', component: resolve => { require(['./views/gate/group.edit.vue'], resolve); } },
        { path: 'gategroup/edit/:id', meta: { title: '编辑闸机组' }, name: 'gategroup.edit', component: resolve => { require(['./views/gate/group.edit.vue'], resolve); } },
        { path: 'face/add', meta: { title: '新增用户' }, name: 'face.add', component: resolve => { require(['./views/face/edit.vue'], resolve); } },
        { path: 'face/edit/:id', meta: { title: '编辑用户' }, name: 'face.edit', component: resolve => { require(['./views/face/edit.vue'], resolve); } },
    ]
};

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page401,
    page404
];
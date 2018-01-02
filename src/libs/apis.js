import iView from 'iview';
import axios from 'axios';
import qs from 'qs';
import config from '../config/config';
import apiurl from './apiurl';
import store from './store';

// 生产环境请注释次代码
import mockConfig from './mockConfig.js'


// 加载中组件
let LoadTip = {
    msg: null,
    open() {
        iView.LoadingBar.start();
    },
    close() {
        iView.LoadingBar.finish();
    },
    error() {
        iView.LoadingBar.error();
    }
};

let apis = {};

// 配置axios实例
let ainstance = axios.create({
    baseURL: config.basicUrl,
    timeout: 30000,
    withCredentials: true, // default
    transformRequest: function(data) {
        return data;
    },
    validateStatus: function(status) {
        if (status >= 200 && status < 300) {
            return status >= 200 && status < 300; // default
        } else {
            iView.Message.error('请求错误（' + status + ")，请尝试刷新网页。");
        }
    }
});

ainstance.interceptors.request.use(function(config) {
    LoadTip.open();
    return config;
}, function(err) {
    return Promise.reject(err);
});


// 遍历api.url配置实例
for (let i in apiurl) {
    let parmas = apiurl[i].split(','),
        url = parmas[1],
        method = parmas[0] ? parmas[0].toUpperCase() : 'GET',
        curInstance;

    apis[i] = (parmas, hooks) => {
        parmas = parmas || {};
        const method_ = method.toLowerCase();
        const hooks_ = hooks || {};

        if (hooks_.before) { hooks_.before(); } // before 钩子
        if (method === 'POST' || method === 'PUT' || method == 'PATCH') {
            curInstance = ainstance[method_](url, qs.stringify(parmas));
        } else {
            curInstance = ainstance[method_](url, {
                params: parmas
            });
        }

        return curInstance.then((response) => {
            if (hooks_.done) { hooks_.done(response); } // done 钩子
            LoadTip.close();
            if (typeof response.data !== 'object') {
                return Promise.reject({
                    code: 'DATAERROR',
                    msg: response.msg || '获取数据失败'
                });
            }

            // 如果返回code不为1, 则请求异常 [未登录, 没有权限]
            if (response.data.code != 1) {
                return Promise.reject(response.data);
            }
            return response.data;
        }).catch((result) => {
            if (hooks_.done) { hooks_.done(result); } // done 钩子
            LoadTip.error();
            store.commit('upError', result);
            let errorMsg = result.msg || '';
            if (result.code == 401) { // 未登录
                location.href = '#/login';
                return Promise.reject(result);
            } else if (result.code == 403) {
                location.href = '#/error';
            } else if (result.code == 'ECONNABORTED') {
                errorMsg = '请求超时，请检查网络链接并尝试刷新网页。';
            } else if (result.code == 'DATAERROR') {
                errorMsg = '获取数据失败';
            } else if (result.code == 601) {
                result.data = result.data || {};
                const errorAr = [];
                for (let i in result.data) {
                    errorAr.push(result.data[i]);
                }
                errorMsg = errorAr.join(",") || '获取数据失败';
            } else {
                errorMsg = result.msg
            }
            if (!parmas.noErrorMsg) {
                iView.Message.error(errorMsg);
            }
            return Promise.reject(result);
        });
    };
}

function install(Vue) {
    if (install.installed) {
        return;
    }
    install.installed = true;

    Object.defineProperty(Vue.prototype, '$apis', {
        get: function get() {
            return apis;
        }
    });

}

var inBrowser = typeof window !== 'undefined';
apis.install = install;

if (inBrowser && window.Vue) {
    window.Vue.use(apis);
}

export default apis;
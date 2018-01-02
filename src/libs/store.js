import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config/config';
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

// states
const state = {
    siteName: '特斯联',
    metaName: '特斯联人脸识别系统',
    breadcrumb: [],
    basicUrl: config.basicUrl,
    docUrl: config.docUrl,
    pageSize: 25, // 分页
    error: null,
    dateRangeOptions: {
        // 日历范围控件options
        shortcuts: [{
                text: '最近一周',
                value() {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    return [start, end];
                }
            },
            {
                text: '最近一个月',
                value() {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    return [start, end];
                }
            },
            {
                text: '最近三个月',
                value() {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    return [start, end];
                }
            }
        ]
    },
    bodyClient: 200
};

// getters
const getters = {
    siteName: state => state.siteName,
    metaName: state => state.metaName,
    basicUrl: state => state.basicUrl,
    docUrl: state => state.docUrl,
    breadcrumb: state => state.breadcrumb,
    pageSize: state => state.pageSize,
    error: state => state.error,
    dateRangeOptions: state => state.dateRangeOptions,
    bodyClient: state => state.bodyClient
};

// actions
const actions = {
    storeBodyClient({ commit, state }) {
        const clientH = document.documentElement.clientHeight;
        commit('bodyClient', clientH - 150 > 200 ? clientH - 200 : 200);
    }
};

// mutations
const mutations = {
    metaName(state, name) {
        state.metaName = name;
    },
    breadcrumb(state, breadcrumb) {
        state.breadcrumb = breadcrumb;
    },
    upPageSize(state, pagesize) {
        state.pageSize = pagesize;
    },
    upError(state, error) {
        state.error = error;
    },
    bodyClient(state, high) {
        state.bodyClient = high;
    }
};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    strict: debug
});
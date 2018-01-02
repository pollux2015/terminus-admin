import Vue from 'vue';
import Vuex from 'vuex';
import apis from './apis';
import lodash from './util';
import config from '../config/config';
import VueCookie from 'vue-cookie';
Vue.use(Vuex);

import Menutest from '../menus.js';

const debug = process.env.NODE_ENV !== 'production';

// states
const state = {
  siteName: '优课在线',
  metaName: '机构后台',
  onlycontent: false, // 只显示内容区域
  metaShow: true,
  basicUrl: config.basicUrl,
  docUrl: config.docUrl,
  userEmail: '', // 用户Email
  pageSize: 25, // 分页
  menus: [],
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
  tableClient: 200
};

// getters
const getters = {
  siteName: state => state.siteName,
  metaName: state => state.metaName,
  metaShow: state => state.metaShow,
  onlycontent: state => state.onlycontent,
  basicUrl: state => state.basicUrl,
  docUrl: state => state.docUrl,
  userEmail: state => state.userEmail,
  pageSize: state => state.pageSize,
  menus: state => state.menus,
  error: state => state.error,
  dateRangeOptions: state => state.dateRangeOptions,
  tableClient: state => state.tableClient
};

// actions
const actions = {
  menus({ commit, state }) {
    // commit('menus', Menutest);
    // return;
    const menuIcons = {
      portal: 'earth',
      org: 'help-buoy',
      course: 'film-marker',
      analytics: 'ios-analytics',
      audit: 'clipboard',
      system: 'ios-gear'
    };
    apis.menus({ noErrorMsg: true }).then(res => {
      let result = [];
      let data = lodash.map(res.data, 'children');
      lodash.forEach(data, (item, index) => {
        if (!item) {
          item = [];
        }
        result = lodash.concat(result, item);
      });
      commit('menus', {
        origin: res.data || [],
        submenus: result || []
      });
    });
  },
  storeTableClient({ commit, state }) {
    const clientH = document.documentElement.clientHeight;
    commit('tableClient', clientH - 200 > 200 ? clientH - 200 : 200);
  }
};

// mutations
const mutations = {
  metaName(state, name) {
    state.metaName = name;
  },
  metaShow(state, status) {
    state.metaShow = status;
  },
  onlycontent (state, status){
    state.onlycontent = status;
  },
  menus(state, menus) {
    state.menus = menus;
  },
  userEmail(state, email) {
    state.userEmail = email;
  },
  upPageSize(state, pagesize) {
    state.pageSize = pagesize;
  },
  upError(state, error) {
    state.error = error;
  },
  tableClient(state, high) {
    state.tableClient = high;
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug
});

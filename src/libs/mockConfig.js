import Mock from 'mockjs'
const Random = Mock.Random
import aipurl from './apiurl';
import lodash from 'lodash'

// 循环生成表达式
let aipurl_ = {};
const url = lodash.forEach(aipurl, (item, key) => {
    let orgUrl = item.split(',')[1];
    aipurl_[key] = RegExp(orgUrl);
});

// 静态变量
const CUR_DATE = Mock.mock('@date');

Mock.mock(aipurl_.login, {
    code: 1,
    'msg': '登陆成功'
});

Mock.mock(aipurl_.logout, {
    code: 1,
    'msg': '退出成功'
});

Mock.mock(aipurl_.menus, {
    code: 1,
    data: [{
        id: 1,
        icon: 'cube',
        url: 'home',
        name: '首页'
    }, {
        id: 2,
        icon: 'cube',
        url: 'company',
        name: '单位管理'
    }, {
        id: 3,
        icon: 'social-instagram',
        url: 'face',
        name: '人脸管理'
    }, {
        id: 4,
        icon: 'android-boat',
        url: 'gate',
        name: '闸机管理'
    }, {
        id: 5,
        icon: 'document-text',
        url: 'log',
        name: '通行日志'
    }, {
        id: 6,
        url: 'sys',
        icon: 'gear-a',
        name: '系统管理'
    }]
});
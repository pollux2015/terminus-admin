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

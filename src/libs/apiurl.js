/**
 * api接口文档
 * 例: "login": "POST,/user/login",
 */
export default {
    // Common
    'login': 'POST,/admin/index/login',
    'logout': 'POST,/admin/index/logout',
    'menus': 'GET,/admin/index/menu',

	// 单位管理
    'companyAll': 'GET,/admin/company/all',
    'companyList': 'GET,/admin/company/index',
    'companyInfo': 'GET,/admin/company/info',
    'companyEdit': 'GET,/admin/company/edit',
    'companyDel': 'GET,/admin/company/delete',

    // 日志管理
    'logHistory': 'GET,/admin/log/history',
    'logDel': 'GET,/admin/log/delete',

    // 闸机组管理
    'gateGroup': 'GET,/gate/group',
    'gateGroupAll': 'GET,/gategroup/groupall',
    'gateGroupInfo': 'GET,/gategroup/info',
    'gateGroupEdit': 'GET,/gategroup/edit',
    'gateGroupDel': 'GET,/gategroup/del',
    
    // 闸机管理
    'gateList': 'GET,/gate/list',
    'gateAll': 'GET,/gate/all',
    'gateInfo': 'GET,/gate/info',
    'gateEdit': 'GET,/gate/edit',
    'gateDel': 'GET,/gate/delete',

    // 人脸管理
    'faceList': 'GET,/face/list',
    'faceInfo': 'GET,/face/info',
    'faceEdit': 'GET,/face/edit',
    'faceDel': 'GET,/face/delete',
    'faceFrozen': 'GET,/face/frozen',




};
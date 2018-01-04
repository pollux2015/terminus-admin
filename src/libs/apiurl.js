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
		'gateList': 'GET,/admin/gate/list',
    'companyList': 'GET,/admin/company/index',
    'companyInfo': 'GET,/admin/company/info',
    'companyEdit': 'GET,/admin/company/edit',
    'companyDel': 'GET,/admin/company/delete',

    // 日志管理
    'logHistory': 'GET,/admin/log/history',
    'logDel': 'GET,/admin/log/delete',
};
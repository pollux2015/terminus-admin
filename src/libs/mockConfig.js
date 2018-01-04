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
const PAGE = {
    'total|1-15': 1,
    'page|1-15': 1,
    'cur|1-10': 1,
    'pagesize': 3,
    'pages|1-15': 1
}

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


/**-----------------------------------
 * 单位管理
 -----------------------------------*/
Mock.mock(aipurl_.companyAll, {
    code: 1,
    'data|3': [{
        'id|+1': ['1', '2', '3'],
        'name|+1': ['深圳市一只牛科技有限公司', '深圳市盛大有限公司', '深圳市腾达科技有限公司']
    }]
});

Mock.mock(aipurl_.companyList, {
    code: 1,
    data: {
        page: PAGE,
        'data|25': [{
            'id': '@id',
            'company|1': ['深圳市一只牛科技有限公司', '深圳市盛大有限公司', '深圳市腾达科技有限公司'],
            'contact|1': '@cname',
            'phone|1': ['18664356411', '18975626643', '18607368249'],
            'tenancy|1-100': 100
        }]
    }
});

Mock.mock(aipurl_.companyInfo, {
    code: 1,
    'data': {
        'id': '@id',
        'company|1': ['深圳市一只牛科技有限公司', '深圳市盛大有限公司', '深圳市腾达科技有限公司'],
        'contact|1': '@cname',
        'phone|1': ['18664356411', '18975626643', '18607368249'],
        'floor|1': ['A栋b11', 'A栋B12'],
        'gate': '1,2',
        tenancy: '这里是租期的介绍',
        start_time: '2018-01-01',
        end_time: '2018-06-06'
    }
});

Mock.mock(aipurl_.companyEdit, {
    code: 1,
    'msg': '编辑成功'
});

Mock.mock(aipurl_.companyDel, {
    code: 1,
    'msg': '删除成功'
});


/**-----------------------------------
 * 通行日志
 -----------------------------------*/
Mock.mock(aipurl_.logHistory, {
    code: 1,
    data: {
        page: PAGE,
        'data|25': [{
            'id': '@id',
            'name|1': '@cname',
            'gate|1': ['东大门1号闸', '西大门2号闸', '北大门3号闸'],
            'start_time': '@datetime',
            'picture|1': ['http://img.zcool.cn/community/01f6075a4defa1a8012197417988f6.jpg', 'http://img.zcool.cn/community/018eaf5a4defaea80121974199542b.jpg@1280w_1l_2o_100sh.jpg'],
            'video': 'http://source1.uooconline.com/course695/video//2%E5%88%8629.mp4'
        }]
    }
});

Mock.mock(aipurl_.logDel, {
    code: 1,
    'msg': '删除成功'
});


/**-----------------------------------
 * 闸机组管理
 -----------------------------------*/

Mock.mock(aipurl_.gateGroupAll, {
    code: 1,
    'data': [{
        'id': '1',
        'name': '闸机组1'
    }, {
        'id': '2',
        'name': '闸机组2'
    }, {
        'id': '3',
        'name': '闸机组3'
    }]
});


Mock.mock(aipurl_.gateGroup, {
    code: 1,
    data: {
        page: PAGE,
        'data|25': [{
            'id': '@id',
            'name|1': ['闸机组A', '闸机组B', '闸机组C'],
            'gates|1': ['东大门1号闸,西大门2号闸', '南大门4号闸, 北大门5号闸'],
            'created_time': '@datetime'
        }]
    }
});

Mock.mock(aipurl_.gateGroupDel, {
    code: 1,
    'msg': '删除成功'
});


Mock.mock(aipurl_.gateGroupEdit, {
    code: 1,
    'msg': '编辑成功'
});

Mock.mock(aipurl_.gateGroupInfo, {
    code: 1,
    'data': {
        'id': '@id',
        'name|1': ['闸机组A', '闸机组B', '闸机组C'],
        'gates': '1,2'
    }
});

/**-----------------------------------
 * 闸机管理
 -----------------------------------*/

Mock.mock(aipurl_.gateList, {
    code: 1,
    data: {
        page: PAGE,
        'data|25': [{
            'id': '@id',
            'name|1': ['东大门1号闸', '西大门2号闸', '南大门4号闸', '北大门5号闸'],
            'ip': '@ip',
            'status|+1': ['0', '1'],
            'status_msg|+1': ['通信异常', '通信正常'],
            'face_status|1': ['0', '1']
        }]
    }
});

Mock.mock(aipurl_.gateAll, {
    code: 1,
    'data|4': [{
        'id|+1': ['1', '2', '3', '4'],
        'name|+1': ['东大门1号闸', '西大门2号闸', '南大门4号闸', '北大门5号闸'],
    }]
});

Mock.mock(aipurl_.gateInfo, {
    code: 1,
    'data': {
        'id': '@id',
        'name|1': ['闸机1', '闸机2', '闸机3'],
        'gate_group': '1',
        'ip': '@ip',
        'port': '8088',
        'face_status|1': ['0', '1']
    }
});

Mock.mock(aipurl_.gateEdit, {
    code: 1,
    'msg': '编辑成功'
});

Mock.mock(aipurl_.gateDel, {
    code: 1,
    'msg': '删除成功'
});

/**-----------------------------------
 * 人脸管理
'faceList': 'GET,/face/list',
'faceInfo': 'GET,/face/info',
'faceEdit': 'GET,/face/edit',
'faceDel': 'GET,/face/delete',
'faceFrozen': 'GET,/face/frozen',
 -----------------------------------*/

Mock.mock(aipurl_.faceList, {
    code: 1,
    data: {
        page: PAGE,
        'data|25': [{
            'id': '@id',
            'name': '@cname',
            'company|1': ['深圳市一只牛科技有限公司', '深圳市盛大有限公司', '深圳市腾达科技有限公司'],
            'phone|1': ['18664356411', '18975626643', '18607368249'],
            'status|+1': ['0', '1'],
            // 'status_msg|+1': ['异常', '正常'],
            'face_status|1': ['0', '1'],
            'frozen|1': ['0', '1']
        }]
    }
});

Mock.mock(aipurl_.faceInfo, {
    code: 1,
    'data': {
        'id': '@id',
        'name': '@cname',
        'phone|1': ['18664356411', '18975626643', '18607368249'],
        'card': '@id',
        'company': '1',
        'gates': '1,2',
        'start_time': '2018-01-01',
        'end_time': '2018-06-06',
        'pass_time|1-100': 1, 
        'face_group|1': 'http://img.zcool.cn/community/01f6075a4defa1a8012197417988f6.jpg,http://img.zcool.cn/community/018eaf5a4defaea80121974199542b.jpg@1280w_1l_2o_100sh.jpg',
    }
});

Mock.mock(aipurl_.faceEdit, {
    code: 1,
    'msg': '编辑成功'
});

Mock.mock(aipurl_.faceDel, {
    code: 1,
    'msg': '删除成功'
});

Mock.mock(aipurl_.faceFrozen, {
    code: 1,
    'msg': '冻结成功'
});
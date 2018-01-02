# terminus-admin 特斯联人脸识别系统
> 请预先安装Node.js, npm, webpack

## 前端框架
* vueJs2.0 
* iView

### 1.安装依赖
```
$ npm install (如果安装太慢)
$ 或cnpm install(安装淘宝镜像) https://github.com/cnpm/cnpm
```

### 2.启动服务(测试)
```
$ npm run dev
```
### 3.编辑打包
```
$ npm run build
```

### 4.SRC主要文件说明
```
* main.js 项目入口, 配置依赖, 注入相关公共模块;
* libs/apis.js axios接口全局配置;
* libs/apiurl.js 接口配置;
* libs/mockConfig.js mock测试数据(可删除);
* libs/util.js 项目通用方法;
* libs/validate.js  自定义表单验证;
* libs/store.js vuex全局状态配置;
* config/config 全局静态变量配置;
```

### 5.已注入的模块, 组件内通过this访问相关
```
接口模块: Vue.use(apis);
this.$apis['funcName']
```
```
验证模块: Vue.use(rules);
this.$rules['funcName']
```
```
util模块: Vue.use(util); 包含全局自定义方法以及继承lodash方法
this.$util['funcName'];
```
Lodash文档: https://lodash.com/docs

```
路由模块: Vue.use(VueRouter);
router实例: this.$router,  获取路由参数: this.$route
```
http://router.vuejs.org/zh-cn/essentials/getting-started.html

```
iview模块: Vue.use(iView);
iview框架提供的相关方法如: this.$Message.error(config);
```
https://www.iviewui.com/

```
vuex模块: Vue.use(Vuex); 存储全局变量, 或其他需要全局存取的数据
GET: this.$store.getters, SET: this.$store.commit(), Fetch: this.$store.dispatch()
```
https://vuex.vuejs.org/zh-cn/

### 6.Response数据约定
```
$ response 
{
  code: 1, // 1: 数据正常, 401: 未登录, 其他: 系统弹出全局错误提示
  data: {
    data: [{ // 具体数据
      name: apple,
      price: $1
    },{
      name: banana,
      price: $2
    }],
    page: { // 分页
      total: 100, // (int) 总条100条
      page: 1,  // (int)当前第1页
      pagesize: 10, //  (int)每页显示10条
      pages: 10 // (int) 共10页
    }
  },
  msg: '添加成功'
}





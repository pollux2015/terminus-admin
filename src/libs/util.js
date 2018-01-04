import lodash from 'lodash';

// 公共方法
let util = {
    setTitle(title) {
        title = title ? title : 'Terminus';
        window.document.title = title;
    },
    /**
     * [swap 交换数组位置]
     * @param  {[Array]} list [原始数组]
     * @param  {[Number]} from [开始位置]
     * @param  {[Number]} to   [目标位置]
     * @return {[Array]}      [原数组]
     */
    swap(list, from, to) {
        const temp = list[to];
        list[to] = list[from];
        list[from] = temp;
        return list;
    },
    /**
     * [filterValue 获取keyArray包含属性的对象]
     * @param  {[Object]} orginData [原对象]
     * @param  {[Array]} keyArray  [所需属性]
     * @return {[Object]}          [新对象]
     */
    filterValue(orginData, keyArray) {
        let nobj = {};
        lodash.forEach(orginData, (value, key) => {
            var isNeed = lodash.indexOf(keyArray, key) > -1;
            if (isNeed) {
                nobj[key] = value;
            }
        });
        return nobj;
    },
    // 计算2日期之间相差的周数或天数
    getDateDiff(date, date2, day) {
        // 参数不能为空
        if (!date || !date2) return "";

        // 格式化传入日期获得毫秒数
        var start = new Date(date.replace(new RegExp("-", "gm"), "/"));
        var end = new Date(date2.replace(new RegExp("-", "gm"), "/"));
        var diff = end > start ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : 0;

        // 取正数
        if (diff < 0) {
            diff *= -1;
        };

        if (day == 'day') {
            // 存在第三个参数 'day' 则返回当前的天数
            return diff;
        } else {
            // 否则返回当前周数
            var w = Math.ceil(diff / 7);
            return w;
        };
    },
    isPhone(str) {
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        return reg.test(lodash.trim(str));
    },
    // 格式化手机号
    phoneFormat(str, symbol) {
        let tel = lodash.trim(str);
        let gap = symbol || ' ';
        if (this.isPhone(tel)) {
            tel = tel.substring(0, 3) + gap + tel.substring(3, 7) + gap + tel.substring(7, 11);
        }
        return tel;
    },
    　　　
    /**----------------------------------------------------
     * Table
     ----------------------------------------------------*/
    /**
     * [getTableData 获取表格数据]
     * @param  {[type]} contxt     [this对象]
     * @param  {[type]} options    [参数, methodName为方法名]
     * @param  {[type]} forceReset [是否强制删除]
     * @return {[type]}            [promise]
     */
    getTableData(contxt, options, forceReset) {
        /**
         * rest事件绑定在组件的change事件上,
         * rest多个组件会GET多次
         */
        if (contxt.isRest && !forceReset) {
            return;
        } else if (forceReset) {
            contxt.isRest = false;
        }
        // 默认参数
        let defaultParams = {
            page: options.page || contxt.page.cur + 1,
            pagesize: contxt.pageSize
        };

        // 合并参数
        const params_ = lodash.assign(defaultParams, contxt.queryParams, options);
        return contxt.$apis[options.methodName](params_).then(res => {

            // table都滚动到顶部
            var tableEle = document.querySelector('.ivu-table-body');
            if(tableEle){
                tableEle.scrollTop = 0
            }
            // 设置table值
            contxt.tableData = res.data.data;
            contxt.page = res.data.page || {};

            // 添加location分页
            contxt.$router.push({
                query: {
                    page: contxt.page.cur || 1
                }
            });
            return res;
        });
    },
    /**
     * [delTableActive 删除表格activeParams数据]
     * @param  {[Object]} contxt [this对象]
     * @param  {[String]} tipMsg [删除成功后的提示信息]
     * contxt必须项
     * 1. activeParams, 2. tableData 表格数据, 3. page 分页对象, 4. pageSize // 每页显示条数
     * contxt非必须
     * 1. modalLoading, 2. modelDel
     */
    delTableActive(contxt, tipMsg) {
        contxt.tableData.splice(contxt.activeParams.index, 1);
        --contxt.page.total;
        if (contxt.tableData.length + 1 == contxt.pageSize) {
            contxt.getData(contxt.page.cur);
        } else if (contxt.tableData <= 0 && contxt.page.cur != 1) {
            contxt.getData(contxt.page.cur - 1);
        }
        contxt.modalLoading = false;
        contxt.modelDel = false;
        contxt.$Message.success(tipMsg || '删除成功');
    },
    /**
     * [delTableGroup 批量删除表格selectedGroup]
     * @param  {[Object]} contxt [this对象]
     * @param  {[String]} tipMsg [删除成功后的提示信息]
     * contxt必须
     * 1. selectedGroup, 2. tableData 表格数据, 3. page 分页对象, 4. pageSize // 每页显示条数
     * contxt非必须
     * 1. modalLoading, 2. modelDel
     */
    delTableGroup(contxt, tipMsg) {
        this.setTableGroup(contxt, (item, index) => {
            contxt.tableData.splice(index, 1);
            --contxt.page.total;
        }, tipMsg);
        if (contxt.tableData.length + 1 == contxt.pageSize) {
            contxt.getData(contxt.page.cur);
        } else if (contxt.tableData <= 0 && contxt.page.cur != 1) {
            contxt.getData(contxt.page.cur - 1);
        } else {
            contxt.getData(1);
        }
    },
    /**
     * [setTableGroup 批量操作表格设置属性selectedGroup]
     * @param  {[Object]} contxt [this对象]
     * @param  {[String]} tipMsg [成功后的提示]
     * contxt必须项
     * 1. selectedGroup, 2. tableData 表格数据, 3.callback 回调
     */
    setTableGroup(contxt, callback, tipMsg) {
        lodash.forEach(contxt.selectedGroup, (curid) => {
            lodash.forEach(contxt.tableData, (item, index) => {
                if (item && item.id == curid) {
                    callback(item, index);
                }
            });
        });
        contxt.$Message.success(tipMsg || '操作成功');
    },
    /**----------------------------------------------------
     * Table Render
     ----------------------------------------------------*/
    /**
     * [renderTimer renderTable时间显示]
     * @param  {[function]} h        [vue render]
     * @param  {[object]} params   [table行]
     * @param  {[object]} options     [toggale组件相关参数]
     *  @return {[object]}          [renderElement]
     */
    renderToggle(h, params, options) {
        const row = params.row;
        const isActive = options.active;
        return h('i-switch', {
            props: {
                size: 'large',
                value: isActive,
            },
            on: {
                'on-change': (status) => {
                    options.change(status);
                }
            }
        }, [h('span', {
            slot: 'open'
        }, options.open || '是'), h('span', {
            slot: 'close'
        }, options.close || '否')])
    },
    /**
     * [renderTimer renderTable时间显示]
     * @param  {[function]} h        [vue render]
     * @param  {[object]} params   [table行]
     * @param  {[string]} name     [Date字段名]
     * @param  {[boolen]} onlyDate [是否只显示日期]
     * @return {[object]}          [renderElement]
     */
    renderDate(h, params, name, onlyDate) {
        const row = params.row;
        if (!row[name]) {
            return '-'
        }
        const timeAr = row[name].split(' ');
        if (onlyDate) {
            return h('div', timeAr[0])
        } else {
            return h('div', [
                h('div', timeAr[0]),
                h('div', {
                    style: {
                        color: '#999'
                    }
                }, timeAr[1])
            ]);
        }
    },
    /**
     * [renderIndex renderTable索引]
     * @param  {[function]} h        [vue render]
     * @param  {[object]} params   [table行]
     * @param  {[number]} curPage     [当前页]
     * @param  {[number]} pageSize [每页显示条数]
     * @return {[number]}          [索引]
     */
    renderIndex(h, params, curPage, pageSize) {
        const curPage_ = curPage || 1;
        return pageSize * (curPage_ - 1) + (params.index + 1);
    },
    /**
     * [renderButtonGroup renderTable操作按钮]
     * @param  {[function]} h        [vue render]
     * @param  {[object]} params   [table行]
     * @param  {[array]} group     [按钮参数, disabled: 是否无法操作, icon: 图标, title: '名称', click: 点击事件]
     */
    renderButtonGroup(h, params, group) {
        const btnGroup = [];
        lodash.forEach(group, (item) => {
            btnGroup.push(h('Button', {
                attrs: {
                    title: item.title
                },
                props: {
                    disabled: item.disabled,
                    type: item.type || 'ghost',
                    icon: item.icon || 'clipboard',
                    size: 'small'
                },
                on: {
                    click: () => {
                        if (item.click) {
                            item.click();
                        }
                    }
                }
            }, item.text))
        });
        return h('ButtonGroup', btnGroup);
    },
    /**
     * [renderHref A标签显示]
     * @param  {[function]} h        [vue render]
     * @param  {[object]} params   [table行]
     * @param  {[array]} attrs     [按钮参数, href: 链接, orgin: 是否显示为元链接地址不设置则显示为文字 '外链']
     */
    renderHref(h, params, attrs) {
        if (attrs.href == "#") {
            return h('span', '#')
        } else if (!attrs.href) {
            return h('span', '-')
        } else if (attrs.orgin) {
            return h('a', {
                attrs
            }, attrs.href)
        } else {
            return h('a', {
                attrs
            }, '外链')
        }

    }
};


lodash.assignIn(util, lodash);

function install(Vue) {
    if (install.installed) {
        return;
    }
    install.installed = true;

    Object.defineProperty(Vue.prototype, '$util', {
        get: function get() {
            return util;
        }
    });

}

var inBrowser = typeof window !== 'undefined';
util.install = install;

if (inBrowser && window.Vue) {
    window.Vue.use(util);
}

export default util;
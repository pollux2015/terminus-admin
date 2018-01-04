<template>
    <div>
        <!-- TableQuery -->
        <div class="tableTools">
            <div class="tableTools-inner">
                <Row class="tableTools-inner">
                    <Col span="18">
                    <Input icon="search" style="width: 200px;" v-model="queryParams.keyword" placeholder="专题名称" @on-click="getData(1)" @on-enter="getData(1)"></Input>
                    </Col>
                    <Col span="6" class="tableFuncs">
                    <Button-group shape="circle">
                        <Button type="primary" icon="plus-circled" @click="goRouter('company.add')">
                            新增单位
                        </Button>
                        <Button title="重置" @click="resetFilter" icon="loop">重置</Button>
                    </Button-group>
                    </Col>
                </Row>
            </div>
        </div>
        <!-- Table -->
        <Table ref="table" :columns="columns" :data="tableData" :height="tableClient" stripe border></Table>
        <!-- Pagination -->
        <div class="pagination">
            <Page :total="page.total" :current="page.cur" @on-change="getData" :page-size="pageSize" show-elevator show-total></Page>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeParams: {}, // 当前选中表格行数据
            queryParams: { // 表格筛选条件
                keyword: '',
            },
            tableData: [], // 表格数据
            page: {}, // 分页
            columns: [{
                title: '序号',
                width: 100,
                align: 'center',
                render: (h, params) => {
                    return this.$util.renderIndex(h, params, this.curPage, this.pageSize);
                }
            }, {
                title: 'ID',
                key: 'id',
                width: 160
            }, {
                title: '单位',
                key: 'company',
            }, {
                title: '联络人',
                key: 'contact',
                align: 'center',
                width: 160,
            }, {
                title: '移动电话',
                key: 'phone',
                align: 'center',
                width: 160,
                render: (h, params) => {
                    const row = params.row;
                    return this.$util.phoneFormat(row.phone, '-')
                }
            }, {
                title: '租期(月)',
                width: 140,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            color: 'blue'
                        }
                    }, row.tenancy);
                }
            }, {
                title: '操作',
                key: 'address',
                width: 180,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return this.$util.renderButtonGroup(h, params, [{
                        icon: 'edit',
                        text: '编辑',
                        click: () => {
                            this.goRouter('company.edit', {
                                id: row.id
                            })
                        }
                    }, {
                        icon: 'close',
                        text: '删除',
                        click: () => {
                            this.activeParams = params;
                            this.delData();
                        }
                    }]);
                }
            }]
        }
    },
    computed: {
        tableClient() {
            return this.$store.getters.bodyClient - 150 - 130;
        },
        pageSize() { // 分页大小
            return this.$store.getters.pageSize;
        }
    },
    mounted() {
        // 获取数据
        const curPage = this.$route.query.page || 1;
        this.getData(curPage);
    },
    methods: {
        // 跳转到指定ROUTER
        goRouter(name, params, query) {
            const params_ = params || {};
            const query_ = query || {};
            this.$router.push({
                name: name,
                query: query_,
                params: params_
            });
        },
        // 重置Query
        resetFilter() {
            this.isRest = true;
            this.$util.forEach(this.queryParams, (value, key) => {
                this.queryParams[key] = '';
            });
            setTimeout(() => {
                this.getData(1, true);
            });
        },
        // 清除日历控件
        dateClear() {
            this.daterangeValue = [];
            this.queryParams.start_time = '';
            this.queryParams.end_time = '';
            this.getData(1);
        },
        // 获取表格数据, foceReset
        // 参数在resetFilter时生效, 阻止由重置query数据而导致的多次GET
        getData(page, forceReset) {
            this.$util.getTableData(this, {
                methodName: 'companyList',
                page: page
            }, !!forceReset);
        },
        // 单个Table删除表格
        delData() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '确认删除?',
                content: row.company,
                loading: true,
                onOk: () => {
                    this.$apis.companyDel({
                        id: row.id
                    }).then(res => {
                        console.log(res)
                        this.$util.delTableActive(this, '删除成功');
                        this.$Modal.remove();
                    });
                }
            })
        }
    }
}
</script>
<style scoped>
</style>
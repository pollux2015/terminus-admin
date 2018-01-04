<template>
    <div>
        <!-- TableQuery -->
        <div class="tableTools">
            <div class="tableTools-inner">
                <Row class="tableTools-inner">
                    <Col span="14">
                    <Input icon="search" style="width: 200px;" v-model="queryParams.keyword" placeholder="输入单位/姓名/搜索" @on-click="getData(1)" @on-enter="getData(1)"></Input>
                    </Col>
                    <Col span="10" class="tableFuncs">
                    <Button-group shape="circle">
                        <Button type="primary" icon="plus-circled" @click="goRouter('face.add')">新增</Button>
                        <Button icon="android-upload">导入</Button>
                        <Button icon="android-download">导出</Button>
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
                title: '姓名',
                key: 'name',
                align: 'center',
                width: 130
            }, {
                title: '单位名',
                key: 'company',
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
                title: '冻结',
                align: 'center',
                width: 110,
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            color: row.frozen == 1 ? 'red' : 'green'
                        }
                    }, row.frozen == 1 ? '冻结' : '正常')
                }
            }, {
                title: '人脸',
                align: 'center',
                width: 110,
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            type: 'border',
                            color: row.face_status == 1 ? 'green' : 'red'
                        }
                    }, row.face_status == 1 ? '已录入' : "未录入")
                }
            }, {
                title: '操作',
                key: 'address',
                width: 260,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    const isFrozen = row.frozen == 1;
                    return this.$util.renderButtonGroup(h, params, [{
                        icon: 'android-contact',
                        text: '人脸录入',
                        click: () => {

                        }
                    }, {
                        icon: isFrozen ? 'toggle-filled' : 'toggle',
                        text: isFrozen ? '激活' : '冻结',
                        click: () => {
                            this.activeParams = params;
                            this.changeFrozen();
                        }
                    }, {
                        icon: 'edit',
                        click: () => {
                            this.goRouter('face.edit', {
                                id: row.id
                            })
                        }
                    }, {
                        icon: 'close',
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
        // 获取表格数据, foceReset
        // 参数在resetFilter时生效, 阻止由重置query数据而导致的多次GET
        getData(page, forceReset) {
            this.$util.getTableData(this, {
                methodName: 'faceList',
                page: page
            }, !!forceReset);
        },
        changeFrozen() {
            const row = this.activeParams.row;
            const isFrozen = row.frozen == 1;
            this.$apis.faceFrozen({
                status: isFrozen ? 0 : 1
            }).then(res => {
                row.frozen = isFrozen ? 0 : 1;
                this.$Message.success(isFrozen ? '激活成功' : '冻结成功');
            });
        },
        // 单个Table删除表格
        delData() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '确认删除?',
                content: row.name,
                loading: true,
                onOk: () => {
                    this.$apis.faceDel({
                        id: row.id
                    }).then(res => {
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
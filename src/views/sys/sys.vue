<template>
    <div>
        <Tabs v-model="tabName" style="margin: 15px 0 0;">
            <Tab-pane name="admin" icon="navicon-round" label="后台用户"></Tab-pane>
            <Tab-pane name="role" icon="navicon-round" label="角色管理"></Tab-pane>
        </Tabs>
        <!-- TableQuery -->
        <div class="tableTools" style="border-top-width: 0px; padding-top: 0px;">
            <div class="tableTools-inner">
                <div class="tableTools-inner">
                    <Row>
                        <Col span="14">
                        <Input icon="search" v-model="queryParams.keyword" @on-click="getData(1)" @on-enter="getData(1)" placeholder="请输入" style="width: 200px;"></Input>
                        </Col>
                        <Col span="10" class="tableFuncs">
                        <Button-group shape="circle">
                            <Button type="error" v-if="tabName == 'admin'" icon="plus-circled" @click="goRouter('admin.add')">
                                添加后台用户
                            </Button>
                            <Button type="primary" v-if="tabName == 'role'" icon="plus-circled" @click="goRouter('role.add')">
                                添加角色
                            </Button>
                            <Button title="重置" @click="resetFilter" icon="loop">重置</Button>
                        </Button-group>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <!-- Table -->
        <Table ref="course" :height="tableClient" :columns="tabName == 'admin' ? columnsA : columnsB" :data="tableData" stripe border></Table>
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
            tabName: 'admin',
            tableData: [], // 表格数据
            page: {}, // 分页
            columnsA: [{
                title: '序号',
                width: 100,
                align: 'center',
                render: (h, params) => {
                    return this.$util.renderIndex(h, params, this.curPage, this.pageSize);
                }
            }, {
                title: '姓名',
                key: 'name'
            }, {
                title: '账号',
                key: 'email',
            }, {
                title: '状态',
                align: 'center',
                width: 110,
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            type: 'border',
                            color: row.status == 1 ? 'green' : 'red'
                        }
                    }, row.status == 1 ? '激活' : '冻结')
                }
            }, {
                title: '创建时间',
                width: 180,
                render: (h, params) => {
                    return this.$util.renderDate(h, params, 'created_time');
                }
            }, {
                title: '操作',
                key: 'address',
                width: 160,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return this.$util.renderButtonGroup(h, params, [{
                        icon: 'edit',
                        text: '编辑',
                        click: () => {
                            this.goRouter('admin.edit', {
                                id: row.id
                            })
                        }
                    }, {
                        icon: 'close',
                        text: '删除',
                        click: () => {
                            this.activeParams = params;
                            this.delAdmin();
                        }
                    }]);
                }
            }],
            columnsB: [{
                title: '序号',
                width: 100,
                align: 'center',
                render: (h, params) => {
                    return this.$util.renderIndex(h, params, this.curPage, this.pageSize);
                }
            }, {
                title: '角色名称',
                key: 'name'
            }, {
            	title: '已分配',
              key: 'apply'
            },{
                title: '状态',
                align: 'center',
                width: 110,
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            type: 'border',
                            color: row.status == 1 ? 'green' : 'red'
                        }
                    }, row.status == 1 ? '激活' : '冻结')
                }
            }, {
                title: '更新时间',
                width: 180,
                render: (h, params) => {
                    return this.$util.renderDate(h, params, 'update_time');
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
                        text: '权限分配',
                        click: () => {
                            this.goRouter('role.edit', {
                                id: row.id
                            })
                        }
                    }, {
                        icon: 'close',
                        text: '删除',
                        click: () => {
                            this.activeParams = params;
                            this.delRole();
                        }
                    }]);
                }
            }]
        }
    },
    computed: {
        tableClient() {
            return this.$store.getters.bodyClient - 150 - 180;
        },
        pageSize() { // 分页大小
            return this.$store.getters.pageSize;
        }
    },
    watch: {
        tabName() {
            this.resetFilter();
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
                methodName: this.tabName == 'admin' ? 'adminList' : 'roleList',
                page: page,
            }, !!forceReset);
        },
        delAdmin() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '删除用户?',
                content: row.name,
                loading: true,
                onOk: () => {
                    this.$apis.adminDel({
                        id: row.id
                    }).then(res => {
                        this.$util.delTableActive(this, '删除成功');
                        this.$Modal.remove();
                    });
                }
            })
        },
        delRole() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '删除角色?',
                content: row.name,
                loading: true,
                onOk: () => {
                    this.$apis.roleDel({
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
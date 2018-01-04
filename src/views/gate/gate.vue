<template>
    <div>
        <Tabs v-model="tabName" style="margin: 15px 0 0;">
            <Tab-pane name="gateGroup" icon="navicon-round" label="闸机分组管理"></Tab-pane>
            <Tab-pane name="gate" icon="navicon-round" label="闸机管理"></Tab-pane>
        </Tabs>
        <!-- TableQuery -->
        <div class="tableTools" style="border-top-width: 0px; padding-top: 0px;">
            <div class="tableTools-inner">
                <div class="tableTools-inner">
                    <Row>
                        <Col span="14">
                        <Form ref="queryForm" :label-width="80" label-position="left" inline>
                            <Form-item :label="tabName == 'gateGroup' ? '砸道组名称' : '闸机名称'" style="width: 150px;">
                                <Input v-model="queryParams.keyword" @on-enter="getData(1)" placeholder="请输入" style="width: 200px;"></Input>
                            </Form-item>
                            <Form-item label="闸机" :label-width="50" style="display: none">
                                <Select filterable>
                                </Select>
                            </Form-item>
                        </Form>
                        </Col>
                        <Col span="10" class="tableFuncs">
                        <Button-group shape="circle">
                            <Button type="error" v-if="tabName == 'gate'" icon="plus-circled" @click="goRouter('gate.add')">
                                新增闸机
                            </Button>
                            <Button type="primary" v-if="tabName == 'gateGroup'" icon="plus-circled" @click="goRouter('gategroup.add')">
                                新增闸机组
                            </Button>
                            <Button title="重置" @click="resetFilter" icon="loop">重置</Button>
                        </Button-group>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <!-- Table -->
        <Table ref="course" :height="tableClient" :columns="tabName == 'gateGroup' ? columnsA : columnsB" :data="tableData" stripe border></Table>
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
            tabName: 'gateGroup',
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
                title: '闸机组名称',
                key: 'name',
                width: 160
            }, {
                title: '已分配闸机',
                key: 'gates',
                align: 'center'
            }, {
                title: '通行时间',
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
                            this.goRouter('gategroup.edit', {
                                id: row.id
                            })
                        }
                    }, {
                        icon: 'close',
                        text: '删除',
                        click: () => {
                            this.activeParams = params;
                            this.delGateGroup();
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
                title: '闸道名称',
                key: 'name',
                width: 160
            }, {
                title: '闸机服务IP地址',
                key: 'ip',
                align: 'center',
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
                    }, row.status_msg)
                }
            }, {
                title: '人脸识别',
                align: 'center',
                width: 110,
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            type: 'border',
                            color: row.face_status == 1 ? 'green' : 'red'
                        }
                    }, row.face_status == 1 ? '已开启' : '未开启')
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
                            this.goRouter('gate.edit', {
                                id: row.id
                            })
                        }
                    }, {
                        icon: 'close',
                        text: '删除',
                        click: () => {
                            this.activeParams = params;
                            this.delGate();
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
                methodName: this.tabName == 'gateGroup' ? 'gateGroup' : 'gateList',
                page: page,
            }, !!forceReset);
        },
        delGate() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '确认删除?',
                content: row.name,
                loading: true,
                onOk: () => {
                    this.$apis.gateDel({
                        id: row.id
                    }).then(res => {
                        this.$util.delTableActive(this, '删除成功');
                        this.$Modal.remove();
                    });
                }
            })
        },
        delGateGroup() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '确认删除?',
                content: row.name,
                loading: true,
                onOk: () => {
                    this.$apis.gateGroupDel({
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
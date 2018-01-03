<template>
    <div>
        <!--  tableFuncs -->
        <div class="tableFuncs">
            <Button-group shape="circle">
                <Button type="primary" icon="plus-circled" @click="goRouter('course.special.add')">
                    添加
                </Button>
                <Button icon="toggle-filled" @click="delGroup()">
                    批量删除
                </Button>
                <Button icon="toggle-filled" @click="changeStatus()">
                    批量操作
                </Button>
                <Button title="重置" @click="resetFilter" icon="loop">重置</Button>
            </Button-group>
        </div>
        <!-- TableQuery -->
        <div class="tableTools">
            <div class="tableTools-inner">
                <Row class="tableTools-inner">
                    <Col span="19">
                    <Form ref="queryForm" :label-width="60" label-position="left" inline>
                        <Form-item label="Date">
                            <Date-picker ref="date" v-model="dateValue" type="date" format="yyyy-MM-dd" @on-ok="dateChange" @on-clear="dateClear" confirm placement="bottom-start" placeholder="最后提交时间" style="width: 200px"></Date-picker>
                        </Form-item>
                        <Form-item label="Range">
                            <Date-picker ref="dateRange" v-model="dateRangeValue" type="daterange" format="yyyy-MM-dd" @on-ok="dateChange" @on-clear="dateClear" confirm :options="rangeOptions" placement="bottom-start" placeholder="最后提交时间" style="width: 200px"></Date-picker>
                        </Form-item>
                        <Form-item label="Select">
                            <Select v-model="queryParams.org_id" @on-change="getData(1)" filterable>
                                <Option value="" label="全部"></Option>
                                <Option value="1" label="机构1"></Option>
                                <Option value="2" label="机构2"></Option>
                            </Select>
                        </Form-item>
                    </Form>
                    </Col>
                    <Col span="5">
                    <Input icon="search" v-model="queryParams.keyword" placeholder="专题名称" @on-click="getData(1)" @on-enter="getData(1)"></Input>
                    </Col>
                </Row>
            </div>
        </div>
        <!-- Table -->
        <Table ref="table" :columns="columns" :data="tableData" :height="tableClient" @on-selection-change="selectionChange" stripe border></Table>
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
            selectedGroup: [], // 表格批量选中行数据
            selectedGroupNames: [], // 表格批量选中行Names
            modalLoading: false, // 加载状态
            queryParams: { // 表格筛选条件
                keyword: '',
                org_id: ''
            },
            dateValue: '', // 日历控件Model
            dateRangeValue: [], // 日历范围控件Model
            rangeOptions: this.$store.getters.dateRangeOptions, // 日历控件Options
            tableData: [], // 表格数据
            page: {}, // 分页
            columns: [{
                title: '序号',
                width: 80,
                align: 'center',
                render: (h, params) => {
                    return this.$util.renderIndex(h, params, this.curPage, this.pageSize);
                }
            }, {
                type: 'selection',
                width: 60,
                align: 'center'
            }, {
                title: 'ID',
                key: 'id',
                width: 140
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
                title: '状态',
                key: 'status',
                width: 120,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return this.$util.renderToggle(h, params, {
                        active: row.status == 1,
                        open: '激活',
                        close: '冻结',
                        change: (status) => {
                            console.log(status)
                            // this.selectedGroup = [row];
                            // this.studentFrozen(!switchStatus);
                        }
                    });
                }
            }, {
                title: 'TAG',
                key: 'scope_msg',
                width: 140,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    const isActive = row.status == 1;
                    return h('Tag', {
                        props: {
                            type: 'border',
                            color: isActive ? 'green' : 'red'
                        }
                    }, row.number);
                }
            }, {
                title: '开始时间',
                width: 110,
                render: (h, params) => {
                    return this.$util.renderDate(h, params, 'start_time');
                }
            }, {
                title: '操作',
                key: 'address',
                width: 100,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return this.$util.renderButtonGroup(h, params, [{
                        icon: 'edit',
                        text: '编辑',
                        click: () => {
                            this.goRouter('edit', {
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
        },
        canGroup() { // 当前是否支持批量操作
            return this.selectedGroup.length > 0;
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
            this.$refs.dateRange.handleClear();
            this.$refs.date.handleClear();
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
        // 日历改变
        dateChange(dateRange) {
            const curDateRange = this.$refs.dateRange.formattingDate(this.daterangeValue);
            this.queryParams.start_time = curDateRange[0];
            this.queryParams.end_time = curDateRange[1];
            this.getData(1);
        },
        // 清除表格多选
        clearSelected() {
            this.$refs['table'].selectAll(false);
            this.selectedGroup = [];
        },
        // 表格多选
        selectionChange(selection, index) {
            this.selectedGroup = this.$util.map(selection, 'id');
            this.selectedGroupNames = this.$util.map(selection, 'name');
        },
        // 获取表格数据, foceReset
        // 参数在resetFilter时生效, 阻止由重置query数据而导致的多次GET
        getData(page, forceReset) {
            this.$util.getTableData(this, {
                methodName: 'login',
                page: page
            }, !!forceReset);
        },
        // 批量处理状态
        changeStatus(status) {
            if (!this.canGroup) {
                this.$Message.warning('请选择您要改变的数据');
                return false;
            }
            this.$Modal.confirm({
                title: '批量操作',
                content: this.selectedGroupNames.join(', '),
                loading: true,
                onOk: () => {
                    const ids = this.selectedGroup.join(',');
                    setTimeout(() => {
                        this.$util.setTableGroup(this, (item) => {
                            item.status = 1;
                        });
                        this.clearSelected();
                        this.$Modal.remove();
                    }, 1000);
                }
            });
        },
        // 批量删除Table数据
        delGroup() {
            if (!this.canGroup) {
                this.$Message.warning('请选择您要删除的数据');
            } else {
                this.$Modal.confirm({
                    title: '确认删除?',
                    content: this.selectedGroupNames.join(', '),
                    loading: true,
                    onOk: () => {
                        const ids = this.selectedGroup.join(',');
                        setTimeout(() => {
                            this.$util.delTableGroup(this);
                            this.clearSelected();
                            this.$Modal.remove();
                        }, 1000);
                    }
                });
            }
        },
        // 单个Table删除表格
        delData() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '确认删除?',
                content: row.name,
                loading: true,
                onOk: () => {
                    setTimeout(res => {
                        this.$util.delTableActive(this, '删除成功');
                        this.$Modal.remove();
                    }, 1000)
                }
            })
        }
    }
}
</script>
<style scoped>
</style>
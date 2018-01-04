<template>
    <div>
        <!-- TableQuery -->
        <div class="tableTools">
            <div class="tableTools-inner">
                <Row class="tableTools-inner">
                    <Col span="21">
                    <Form ref="queryForm" :label-width="70" label-position="left" inline>
                        <Form-item label="单位/员工">
                            <Input icon="search" style="width: 200px;" v-model="queryParams.keyword" placeholder="请输入单位/员工" @on-click="getData(1)" @on-enter="getData(1)"></Input>
                        </Form-item>
                        <Form-item label="闸机组" :label-width="50" style="width: 150px;">
                            <Select v-model="queryParams.gate_group" @on-change="getData(1)" filterable>
                                <Option value="" label="所有"></Option>
                                <Option value="1" label="机构1"></Option>
                            </Select>
                        </Form-item>
                        <Form-item label="闸机" :label-width="50" style="width: 150px;">
                            <Select v-model="queryParams.gate" @on-change="getData(1)" filterable>
                                <Option value="0" label="所有"></Option>
                                <Option value="1" label="机构1"></Option>
                            </Select>
                        </Form-item>
                        <Form-item label="时间段" :label-width="50">
                            <Date-picker ref="dateRange" v-model="dateRangeValue" type="daterange" format="yyyy-MM-dd" @on-change="dateChange" @on-clear="dateClear" :options="rangeOptions" placement="bottom-start" placeholder="最后提交时间" style="width: 200px"></Date-picker>
                        </Form-item>
                        <Form-item label="通行方向">
                            <Select v-model="queryParams.pass_way" @on-change="getData(1)" filterable style="width: 100px;">
                                <Option value="0" label="所有"></Option>
                                <Option value="1" label="出"></Option>
                                <Option value="2" label="入"></Option>
                            </Select>
                        </Form-item>
                        <Form-item label="通行方式">
                            <Select v-model="queryParams.pass_direction" @on-change="getData(1)" filterable style="width: 100px;">
                                <Option value="0" label="所有"></Option>
                                <Option value="1" label="RFID"></Option>
                                <Option value="2" label="蓝牙"></Option>
                                <Option value="3" label="人脸识别"></Option>
                            </Select>
                        </Form-item>
                    </Form>
                    </Col>
                    <Col span="3" class="tableFuncs">
                    <Button-group shape="circle">
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
            dateRangeValue: [], // 日历范围控件
            rangeOptions: this.$store.getters.dateRangeOptions, // 日历控件参数
            queryParams: { // 表格筛选条件
                gate_group: '',
                gate: '',
                start_time: '',
                end_time: '',
                pass_way: '',
                pass_direction: ''
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
                width: 160
            }, {
                title: '道闸名',
                key: 'gate',
            }, {
                title: '通行时间',
                key: 'start_time',
                render: (h, params) => {
                    return this.$util.renderDate(h, params, 'start_time');
                }
            }, {
                title: '图片',
                key: 'phone',
                align: 'center',
                width: 120,
                render: (h, params) => {
                    const row = params.row;
                    return h('a', {
                        attrs: {
                            class: 'table-pic',
                            href: row.picture,
                            target: '_blank'
                        }
                    }, [
                        h('img', {
                            attrs: {
                                src: row.picture
                            }
                        })
                    ])
                }
            }, {
                title: '通行视频',
                width: 120,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    if (row.video) {
                        return h('Button', {
                            props: {
                                shape: 'circle',
                                icon: 'social-youtube'
                            },
                            on: {
                                click: () => {
                                    window.open(row.video, '_blank')
                                }
                            }
                        })
                    }
                }
            }, {
                title: '操作',
                key: 'address',
                width: 140,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return this.$util.renderButtonGroup(h, params, [{
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
        dateChange(dateRange) {
            this.queryParams.start_time = dateRange[0];
            this.queryParams.end_time = dateRange[1];
            this.getData(1);
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
                methodName: 'logHistory',
                page: page
            }, !!forceReset);
        },
        // 单个Table删除表格
        delData() {
            const row = this.activeParams.row;
            this.$Modal.confirm({
                title: '确认删除?',
                content: `${row.name}-${row.start_time}通行日志`,
                loading: true,
                onOk: () => {
                    this.$apis.logDel({
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
<template>
    <div>
        <Row :gutter="20" style="margin-top: 10px;">
            <Col span="6">
            <div class="card-info card-info-primary">
                <a href="#/app/gate" class="card-info-mask">
                    <div class="inner">
                        <Icon type="eye" size="30"></Icon>
                    </div>
                </a>
                <Card class="homecard" :bordered="false">
                    <h3>链接闸机</h3>
                    <p>{{statisticsData.gate_total}}</p>
                </Card>
            </div>
            </Col>
            <Col span="6">
            <div class="card-info card-info-success">
                <a href="#/app/face" class="card-info-mask">
                    <div class="inner">
                        <Icon type="eye" size="30"></Icon>
                    </div>
                </a>
                <Card class="homecard" :bordered="false">
                    <h3>管理用户</h3>
                    <p>{{statisticsData.user_total}}</p>
                </Card>
            </div>
            </Col>
            <Col span="6">
            <div class="card-info card-info-warning">
                <a href="#/app/company" class="card-info-mask">
                    <div class="inner">
                        <Icon type="eye" size="30"></Icon>
                    </div>
                </a>
                <Card class="homecard" :bordered="false">
                    <h3>管理单位</h3>
                    <p>{{statisticsData.company_total}}</p>
                </Card>
            </div>
            </Col>
            <Col span="6">
            <div class="card-info card-info-error">
                <a href="#/app/log" class="card-info-mask">
                    <div class="inner">
                        <Icon type="eye" size="30"></Icon>
                    </div>
                </a>
                <Card class="homecard" :bordered="false">
                    <h3>今日出入</h3>
                    <p>{{statisticsData.flow_total}}</p>
                </Card>
            </div>
            </Col>
        </Row>
        <Card style="margin: 10px 0">
            <p slot="title">
                <Icon type="help-buoy"></Icon>
                实时通过信息
            </p>
            <span slot="extra">
            	<Circle slot="extra" style="position: relative; top: -4px;" :size="30" :stroke-width="10" :percent="precent">
				        <span class="circle-inner">{{timer}}</span>
				    	</Circle>
            </span>
            <Table ref="todoTable" :height="tableClient" :columns="columns" :data="tableData" stripe border></Table>
        </Card>
    </div>
</template>
<script>
const INTERVAL_TIMER  = 6;
export default {
    data() {
        return {
        		timer: INTERVAL_TIMER,
        		precent: 100,
            statisticsData: {
                gate_total: 0,
                user_total: 0,
                company_total: 0,
                flow_total: 0
            },
            page: {
                total: 15,
                cur: 1,
                pagesize: 15
            },
            tableData: [],
            columns: [{
                title: '闸道名',
                key: 'gate',
                width: 160
            }, {
                title: '姓名',
                key: 'name',
                align: 'center',
                width: 160
            }, {
                title: '方向',
                key: 'type',
                width: 140,
                align: 'center',
                render: (h, params) => {
                    const row = params.row;
                    return h('Tag', {
                        props: {
                            color: row.direction == 1 ? 'green' : 'red'
                        },
                    }, row.direction_msg);
                }
            }, {
                title: '单位名称',
                key: 'company',
            }, {
                title: '过闸方式',
                width: 180,
                align: 'center',
                key: 'pass_way',
            }, {
                title: '通行时间',
                width: 180,
                render: (h, params) => {
                    return this.$util.renderDate(h, params, 'pass_time');
                }
            }]
        }
    },
    computed: {
        tableClient() {
            return this.$store.getters.bodyClient - 150 - 240;
        }
    },
    methods: {
        getLiveData() {
            this.$apis.livedata().then(res => {
            	// table都滚动到顶部
	            var tableEle = document.querySelector('.ivu-table-body');
	            if(tableEle){
	                tableEle.scrollTop = 0
	            }
              this.tableData = res.data;
              setTimeout(() => {
              	this.intervalData();
              }, 1000)
	         		
            })
        },
        intervalData(){
        	this.timer = INTERVAL_TIMER;
        	if(this.intervalTimer){
        		clearInterval(this.intervalTimer);
        	}
        	this.intervalTimer = setInterval(() => {
						this.timer--;
						this.precent = ((INTERVAL_TIMER - this.timer) / INTERVAL_TIMER) * 100;
						if(this.timer == 0){
							clearInterval(this.intervalTimer);
							this.getLiveData();
						}
	        }, 1000)
        }
    },
    created() {
        this.$apis.statistics().then(res => {
            this.statisticsData = res.data;
        });
        this.getLiveData();
    },
    destroyed(){
    	if(this.intervalTimer){
    		clearInterval(this.intervalTimer);
    	}
    }
}
</script>
<style type="text/css">
.card-info {
    position: relative;
    color: #fff;
    text-align: center;
    border-radius: 3px;
}

.card-info .ivu-card {
    background: none;
}

.card-info-primary {
    background-color: #2d8cf0;
}

.card-info h3 {
    opacity: 0.9;
}

.card-info p {
    font-size: 40px;
}

.card-info-success {
    background-color: #19be6b
}

.card-info-warning {
    background-color: #ff9900;
}

.card-info-error {
    background-color: #ed3f14;
}

.card-info-mask {
    opacity: 0;
    display: none;
    position: absolute;
    z-index: 2;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    cursor: pointer;
}

.card-info-mask .inner {
    text-align: center;
    display: table;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.4);
}

.card-info-mask .ivu-icon {
    color: #fff;
    display: table-cell;
    vertical-align: middle;
}



/*hover*/

.card-info:hover .homecard {
    filter: blur(3px);
    transform: scale(0.8);
}

.card-info:hover .card-info-mask {
    display: block;
    opacity: 1;
}

.homecard,
.card-info-mask {
    transition: all 2s ease-in-out;
}

.circle-inner{font-size: 12px;}
</style>
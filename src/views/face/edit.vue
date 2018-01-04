<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
                <Form-item label="姓名" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="手机号码" prop="phone">
                    <Input v-model.trim="formData.phone" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="证件号码" prop="card">
                    <Input v-model.trim="formData.card" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="所属单位" prop="company">
                    <Select v-model="formData.company" filterable>
                        <Option :value="company.id" :key="company.id" v-for="company in companyList" :label="company.name"></Option>
                    </Select>
                </Form-item>
                <Form-item label="可通行闸机" prop="gates">
                    <Select v-model="formData.gates" multiple filterable>
                        <Option :value="gate.id" :key="gate.id" v-for="gate in gateList" :label="gate.name"></Option>
                    </Select>
                </Form-item>
                <Form-item label="通行有效期" prop="start_time">
                    <Date-picker ref="dateRange" v-model="dateRangeValue" type="daterange" format="yyyy-MM-dd" @on-change="dateChange" @on-clear="dateClear" :options="rangeOptions" placement="bottom-start" placeholder="最后提交时间" style="width: 250px;"></Date-picker>
                </Form-item>
                <Form-item label="有效通行次数" prop="pass_time">
                    <Slider v-model="formData.pass_time" show-input></Slider>
                </Form-item>
                <Form-item label="人像图片" prop="face_group">
                    <ButtonGroup>
                        <Button size="large" icon="checkmark-circled">现场拍摄</Button>
                        <Button size="large" icon="checkmark-circled">脸库录入</Button>
                    </ButtonGroup>
                    <div class="avatar-list">
                        <div class="avater-img" v-for="face in formData.face_group"><a :href="face" target="_blank"><img :src="face"></a></div>
                    </div>
                    <input type="text" v-model="formData.face_group" style="display: none">
                </Form-item>
                <div class="form-footer">
                    <Button size="large" :type="isEdit ? 'error' : 'primary'" icon="checkmark-circled" @click="handleSubmit('formData')">提交</Button>
                    <Button size="large" type="ghost" icon="refresh" @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
                </div>
            </Form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dateRangeValue: [], // 日历范围控件
            rangeOptions: this.$store.getters.dateRangeOptions, // 日历控件参数
            editInfor: {}, // 表单详情
            gateList: [],
            companyList: [],
            formData: { // 表单提交Data
                id: '',
                name: '',
                phone: '',
                card: '',
                company: '',
                gates: [],
                start_time: '',
                end_time: '',
                pass_time: 0,
                face_group: []
            },
            ruleValidate: { // 表单验证
                name: [{
                    required: true,
                    message: '请填写姓名'
                }],
                phone: [{
                    required: true,
                    message: '请填写手机号码'
                }, {
                    validator: this.$rules.phone
                }],
                card: [{
                    required: true,
                    message: '请填写证件号码'
                }],
                company: [{
                    required: true,
                    message: '请选择单位'
                }],
                contact: [{
                    required: true,
                    message: '请填写联系人姓名'
                }],
                start_time: [{
                    required: true,
                    message: '请选择通行有效日期'
                }]
            }
        }
    },
    computed: {
        metaName() {
            return this.$store.getters.metaName;
        },
        isEdit() { // 是否为编辑
            return this.$route.name == 'face.edit';
        }
    },
    beforeRouteEnter: (to, from, next) => {
        const isEdit = to.name === 'face.edit';
        app.$apis.gateAll().then(gate => {
        		app.$apis.companyAll().then(company => {
        			next(app => {
                app.setOrignData(gate.data, company.data);
            	})
        		})
        });
    },
    created() {
        // 若为编辑则获取详情
        if (this.isEdit) {
            this.$apis.faceInfo({
                id: this.$route.params.id
            }).then(res => {
                this.editInfor = res.data;
                this.setInfo();
            });
        }
    },
    methods: {
        // 返回上一页
        goBack() {
            this.$router.go(-1);
        },
        // 提交成功后返回
        submitBack() {
            this.$router.push({
                name: 'face'
            });
        },
        setOrignData(gateData, companyData) {
            this.gateList = gateData || [];
            this.companyList = companyData || [];
        },
        setInfo() {
            var editInfor = this.$util.assign({}, this.editInfor);
            editInfor.gates = editInfor.gates.split(',');
            editInfor.face_group = editInfor.face_group.split(',');
            this.dateRangeValue = [];
            this.dateRangeValue.push(editInfor.start_time);
            this.dateRangeValue.push(editInfor.end_time);
            this.$util.assign(this.formData, editInfor);
        },
        // 清除日历控件
        dateClear() {
            this.daterangeValue = [];
            this.formData.start_time = '';
            this.formData.end_time = '';
        },
        // 日历改变
        dateChange(range) {
            this.formData.start_time = range[0];
            this.formData.end_time = range[1];
        },
        // 提交表单
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                var params = {};
                this.$util.assign(params, this.formData);
                params.gates = params.gates.join(',');
                params.face_group = params.face_group.join(',');
                console.log(params);
                if (valid) {
                    this.$apis.faceEdit(params).then(res => {
                        if (this.isEdit) {
                            this.goBack();
                        } else {
                            this.submitBack();
                        }
                        this.$Message.success(this.isEdit ? '编辑成功' : '添加成功!');
                    });
                }
            })
        },
        // 重置表单
        handleReset(name) {
            this.$refs[name].resetFields();
            if (this.isEdit) {
                this.setInfo();
            } else {
                this.$refs.dateRange.handleClear();
            }
        }
    }
}
</script>
<style scoped>
.form-header {
    text-align: center;
    padding-bottom: 10px;
}

.form-outer {
    margin: 0 auto;
    max-width: 600px;
}

.form-footer {
    text-align: center;
}

.avatar-list {
    padding-top: 10px;
}

.avater-img {
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 4px;
    background-color: #e6e6e6;
}

.avater-img img {
    width: 100%;
    height: 100%;
}
</style>
<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
                <Form-item label="单位名称" prop="company">
                    <Input v-model.trim="formData.company" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="联系人姓名" prop="contact">
                    <Input v-model.trim="formData.contact" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="联系人电话" prop="phone">
                    <Input v-model.trim="formData.phone" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="楼层单元" prop="floor">
                    <Input v-model.trim="formData.floor" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="租期信息" prop="tenancy">
                    <Input type="textarea" v-model.trim="formData.tenancy" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="可通行闸机组" prop="gate">
                    <Select v-model="formData.gate" multiple filterable>
                        <Option :value="gate.id" :key="gate.id" v-for="gate in gateGroupList" :label="gate.name"></Option>
                    </Select>
                </Form-item>
                <Form-item label="通行有效期" prop="start_time">
                    <Date-picker ref="dateRange" v-model="dateRangeValue" type="daterange" format="yyyy-MM-dd" @on-change="dateChange" @on-clear="dateClear" :options="rangeOptions" placement="bottom-start" placeholder="最后提交时间"></Date-picker>
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
            gateGroupList: [],
            formData: { // 表单提交Data
                id: '',
                company: '',
                contact: '',
                phone: '',
                floor: '',
                gate: [],
                tenancy: '',
                start_time: '',
                end_time: ''
            },
            ruleValidate: { // 表单验证
                company: [{
                    required: true,
                    message: '请填写单位名称'
                }],
                contact: [{
                    required: true,
                    message: '请填写联系人姓名'
                }],
                phone: [{
                    required: true,
                    message: '请填写联系人电话'
                }, {
                    validator: this.$rules.phone
                }],
                floor: [{
                    required: true,
                    message: '请填写楼层单元'
                }],
                gate: [{
                    required: true,
                    message: '请选择闸机组'
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
            return this.$route.name == 'company.edit';
        }
    },
    beforeRouteEnter: (to, from, next) => {
        const isEdit = to.name === 'company.edit';
        app.$apis.gateGroupAll().then(res => {
            next(app => {
                app.setGateGroupAll(res.data || [])
            })
        });
    },
    created() {
        // 若为编辑则获取详情
        if (this.isEdit) {
            this.$apis.companyInfo({
                id: this.$route.params.uid
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
                name: 'company'
            });
        },
        setGateGroupAll(data) {
            this.gateGroupList = data || [];
        },
        setInfo() {
            var editInfor = this.$util.assign({}, this.editInfor);
            editInfor.gate = editInfor.gate.split(',');
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
                params.gate = params.gate.join(',');
                if (valid) {
                    this.$apis.companyEdit(this.formData).then(res => {
                        if (this.isEdit) {
                            this.goBack();
                        } else {
                            this.submitBack();
                        }
                        this.$Message.success(this.isEdit ? '编辑成功' : '保存成功!');
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
</style>
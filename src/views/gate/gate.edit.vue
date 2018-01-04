<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
                <Form-item label="闸道名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="所属分组" prop="gate_group">
                    <Select v-model="formData.gate_group" filterable>
                        <Option :value="gate.id" :key="gate.id" v-for="gate in gateGroupList" :label="gate.name"></Option>
                    </Select>
                </Form-item>
                <Form-item label="闸机应用IP地址" prop="ip">
                    <Input v-model.trim="formData.ip" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="通信端口" prop="port">
                    <Input v-model.trim="formData.port" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="开启人脸识别" prop="status">
                    <i-switch size="large" v-model="switchStatus" @on-change="changeSwitch">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
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
            switchStatus: true,
            dateRangeValue: [], // 日历范围控件
            rangeOptions: this.$store.getters.dateRangeOptions, // 日历控件参数
            editInfor: {}, // 表单详情
            gateGroupList: [],
            formData: { // 表单提交Data
                id: '',
                name: '',
                gate_group: '',
                ip: '',
                port: '',
                face_status: 1,
            },
            ruleValidate: { // 表单验证
                name: [{
                    required: true,
                    message: '请填写闸道名称'
                }],
                gate_group: [{
                    required: true,
                    message: '请选择闸机所属分组'
                }],
                ip: [{
                    required: true,
                    message: '请填应用IP地址'
                }],
                port: [{
                    required: true,
                    message: '请填写端口'
                }]
            }
        }
    },
    computed: {
        metaName() {
            return this.$store.getters.metaName;
        },
        isEdit() { // 是否为编辑
            return this.$route.name == 'gate.edit';
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
            this.$apis.gateInfo({
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
                name: 'gate'
            });
        },
        // switchChange
        changeSwitch(status) {
            this.formData.face_status = status ? 1 : 0;
        },
        setGateGroupAll(data) {
            this.gateGroupList = data || [];
        },
        setInfo() {
            var editInfor = this.$util.assign({}, this.editInfor);
            this.switchStatus = editInfor.face_status == 1;
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
                if (valid) {
                    this.$apis.gateEdit(this.formData).then(res => {
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
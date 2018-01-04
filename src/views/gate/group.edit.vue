<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
                <Form-item label="闸机组名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="选择闸机" prop="gates">
                    <Select v-model="formData.gates" multiple filterable>
                        <Option :value="gate.id" :key="gate.id" v-for="gate in gateList" :label="gate.name"></Option>
                    </Select>
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
            formData: { // 表单提交Data
                id: '',
                name: '',
                gates: [],
            },
            ruleValidate: { // 表单验证
                gates: [{
                    required: true,
                    message: '请选择闸机'
                }],
                name: [{
                    required: true,
                    message: '请填写闸机组名称'
                }]
            }
        }
    },
    computed: {
        metaName() {
            return this.$store.getters.metaName;
        },
        isEdit() { // 是否为编辑
            return this.$route.name == 'gategroup.edit';
        }
    },
    beforeRouteEnter: (to, from, next) => {
        const isEdit = to.name === 'company.edit';
        app.$apis.gateAll().then(res => {
            next(app => {
                app.setGateAll(res.data || [])
            })
        });
    },
    created() {
        // 若为编辑则获取详情
        if (this.isEdit) {
            this.$apis.gateGroupInfo({
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
                name: 'gate'
            });
        },
        setGateAll(data) {
            this.gateList = data || [];
        },
        setInfo() {
            var editInfor = this.$util.assign({}, this.editInfor);
            editInfor.gates = editInfor.gates.split(',');
            this.$util.assign(this.formData, editInfor);
        },
        // 提交表单
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                var params = {};
                this.$util.assign(params, this.formData);
                params.gates = params.gates.join(',');
                if (valid) {
                    this.$apis.companyEdit(params).then(res => {
                        if (this.isEdit) {
                            this.goBack();
                        } else {
                            this.submitBack();
                        }
                        this.$Message.success(this.isEdit ? '编辑成功' : '新增成功!');
                    });
                }
            })
        },
        // 重置表单
        handleReset(name) {
            this.$refs[name].resetFields();
            if (this.isEdit) {
                this.setInfo();
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
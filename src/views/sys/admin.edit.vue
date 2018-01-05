<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
                <Form-item label="姓名" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="登录邮箱" prop="email">
                    <Input v-model.trim="formData.email" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="分配角色" prop="role">
                    <Select v-model="formData.role" filterable>
                        <Option :value="role.id" :key="role.id" v-for="role in roleAll" :label="role.name"></Option>
                    </Select>
                </Form-item>
                <Form-item label="状态" prop="status">
                    <i-switch size="large" v-model="switchStatus" @on-change="changeSwitch">
                        <span slot="open">激活</span>
                        <span slot="close">管理</span>
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
            editInfor: {}, // 表单详情
            roleAll: [],
            formData: { // 表单提交Data
                id: '',
                name: '',
                role: '',
                email: '',
                status: 1,
            },
            ruleValidate: { // 表单验证
                name: [{
                    required: true,
                    message: '请填写姓名'
                }],
                role: [{
                    required: true,
                    message: '请选择角色'
                }],
                email: [{
                    required: true,
                    message: '请填写Email'
                }, {
                    type: 'email',
                    message: '请输入合法的Email'
                }]
            }
        }
    },
    computed: {
        metaName() {
            return this.$store.getters.metaName;
        },
        isEdit() { // 是否为编辑
            return this.$route.name == 'admin.edit';
        }
    },
    beforeRouteEnter: (to, from, next) => {
        const isEdit = to.name === 'admin.edit';
        app.$apis.roleAll().then(res => {
            next(app => {
                app.setRoleAll(res.data || [])
            })
        });
    },
    created() {
        // 若为编辑则获取详情
        if (this.isEdit) {
            this.$apis.roleInfo({
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
                name: 'sys'
            });
        },
        // switchChange
        changeSwitch(status) {
            this.formData.status = status ? 1 : 0;
        },
        setRoleAll(data) {
            this.roleAll = data || [];
        },
        setInfo() {
            var editInfor = this.$util.assign({}, this.editInfor);
            this.switchStatus = editInfor.status == 1;
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
                    this.$apis.roleEdit(this.formData).then(res => {
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
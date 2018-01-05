<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120">
                <Form-item label="角色名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="角色权限" prop="limits">
                    <div class="limits-list" v-for="menu in menusList" style="margin-bottom: 5px;" @click="toggleIndex(menu.id)">
                        <Button size="large" :type="inLimits(menu.id) ? 'primary' : 'ghost'" :icon="menu.icon" long>{{menu.name}}</Button>
                    </div>
                </Form-item>
                <Form-item label="状态" prop="status">
                    <i-switch size="large" v-model="switchStatus" @on-change="changeSwitch">
                        <span slot="open">激活</span>
                        <span slot="close">冻结</span>
                    </i-switch>
                </Form-item>
                <Form-item>
                    <div class="form-footer">
                        <Button size="large" :type="isEdit ? 'error' : 'primary'" icon="checkmark-circled" @click="handleSubmit('formData')">提交</Button>
                        <Button size="large" type="ghost" icon="refresh" @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
                    </div>
                </Form-item>
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
            menusList: [],
            formData: { // 表单提交Data
                id: '',
                name: '',
                limits: [],
            },
            ruleValidate: { // 表单验证
                name: [{
                    required: true,
                    message: '请填写角色名称'
                }],
                limits: [{
                    required: true,
                    message: '请选择角色权限'
                }],
            }
        }
    },
    computed: {
        metaName() {
            return this.$store.getters.metaName;
        },
        isEdit() { // 是否为编辑
            return this.$route.name == 'role.edit';
        }
    },
    beforeRouteEnter: (to, from, next) => {
        const isEdit = to.name === 'role.edit';
        app.$apis.menus().then(res => {
            next(app => {
                app.setBasicAll(res.data || [])
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
        inLimitsIndex(id) {
            return this.$util.indexOf(this.formData.limits, id);
        },
        inLimits(id) {
            return this.inLimitsIndex(id) > -1;
        },
        toggleIndex(id) {
            const limitsIndex = this.inLimitsIndex(id);
            if (limitsIndex > -1) {
                this.formData.limits.splice(limitsIndex, 1)
            } else {
                this.formData.limits.push(id)
            }
        },
        // switchChange
        changeSwitch(status) {
            this.formData.status = status ? 1 : 0;
        },
        setBasicAll(data) {
            this.$util.forEach(data, (item) => {
                item.id += '';
            });
            this.menusList = data || [];
        },
        setInfo() {
            var editInfor = this.$util.assign({}, this.editInfor);
            console.log(editInfor.limits.split(','))
            editInfor.limits = editInfor.limits.split(',');
            this.switchStatus = editInfor.status == 1;
            this.$util.assign(this.formData, editInfor);
        },
        // 提交表单
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var params = {};
                    this.$util.assign(params, this.formData);
                    params.limits = params.limits.join(',');
                    this.$apis.roleEdit(params).then(res => {
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

.limits-list {
    display: inline-block;
    width: 50%;
    font-size: 18px;
}

.limits-list:nth-child(odd) {
    padding-right: 5px;
}
</style>
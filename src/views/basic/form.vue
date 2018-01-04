<template>
    <div class="top-gap">
        <Button shape="circle" class="layout-goback" type="primary" icon="ios-undo" @click="goBack">
            <span>返回</span>
        </Button>
        <div class="form-outer">
            <h2 class="form-header">{{metaName}}</h2>
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="80">
                <Form-item label="邮箱" prop="email">
                    <Input v-model="formData.email" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="姓名" prop="name">
                    <Input v-model="formData.name" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="编号" prop="user_no">
                    <Input v-model="formData.user_no" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="简介" prop="intro">
                    <Input v-model="formData.intro" type="textarea" :autosize="{minRows: 6,maxRows: 6}" placeholder="请输入..."></Input>
                </Form-item>
                <Form-item label="发布状态" prop="status">
                    <i-switch size="large" v-model="switchStatus" @on-change="changeSwitch">
                        <span slot="open">发布</span>
                        <span slot="close">下线</span>
                    </i-switch>
                </Form-item>
                <Form-item label="性别" prop="gender">
                    <Radio-group v-model="formData.gender">
                        <Radio label="1">男</Radio>
                        <Radio label="2">女</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="学院" prop="college_id">
                    <Select v-model="formData.college_id" filterable>
                        <Option :value="college.id" :key="college.id" v-for="college in collegeList" :label="college.name"></Option>
                    </Select>
                </Form-item>
                <Form-item label="职称" prop="title">
                    <Select v-model="formData.title" filterable>
                        <Option :value="key" :key="key" v-for="(value, key) in teacherTitle" :label="value"></Option>
                    </Select>
                </Form-item>
                <Form-item label="Date">
                    <Date-picker ref="date" v-model="dateValue" type="date" format="yyyy-MM-dd" @on-ok="dateChange" @on-clear="dateClear" confirm placement="bottom-start" placeholder="最后提交时间"></Date-picker>
                </Form-item>
                <Form-item label="Range">
                    <Date-picker ref="dateRange" v-model="dateRangeValue" type="daterange" format="yyyy-MM-dd" @on-ok="dateChange" @on-clear="dateClear" confirm :options="rangeOptions" placement="bottom-start" placeholder="最后提交时间"></Date-picker>
                </Form-item>
                <Form-item label="头像" prop="avatar">
                    <div class="img-long" v-if="formData.avatar">
                        <img :src="formData.avatar">
                    </div>
                    <vue-core-image-upload text="上传头像" cropRatio="1:1" @uploaded="imageUploaded">
                    </vue-core-image-upload>
                </Form-item>
                <Form-item label="发布状态" prop="status">
                    <i-switch size="large" v-model="switchStatus" @on-change="changeSwitch">
                        <span slot="open">发布</span>
                        <span slot="close">下线</span>
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
            switchStatus: true, // switch
            dateValue: '', // 日历控件
            dateRangeValue: [], // 日历范围控件
            rangeOptions: this.$store.getters.dateRangeOptions, // 日历控件参数
            editInfor: {}, // 表单详情
            formData: { // 表单提交Data
                id: '',
                email: '',
                checkEmail: '',
                passwd: '',
                college_id: '',
                name: '',
                user_no: '',
                title: '',
                gender: 1,
                intro: '',
                avatar: '',
            },
            ruleValidate: { // 表单验证
                email: [{
                    required: true,
                    message: '请输入Email'
                }, {
                    type: 'email',
                    message: '请输入合法的Email'
                }],
                passwd: [{
                    required: true,
                    validator: this.$rules.validatePass,
                    trigger: 'blur'
                }],
                name: {
                    required: true,
                    pattern: /^.{1,20}$/,
                    message: '姓名在1~20个字符之间'
                },
                gender: [{
                    required: true,
                    message: '请选择性别'
                }]
            }
        }
    },
    computed: {
        metaName() {
            return this.$store.getters.metaName;
        },
        isEdit() { // 是否为编辑
            return this.$route.name == 'members.teacher.edit';
        },
        paramsFilter() { // 表单提交字段
            return ['id', 'email', 'passwd', 'college_id', 'name', 'user_no', 'title', 'gender', 'intro', 'avatar'];
        }
    },
    mounted() {
        // 若为编辑则获取详情
        if (this.isEdit) {
            this.$apis.teacherInfo({
                id: this.$route.params.uid
            }).then(res => {
                this.editInfor = res.data;
                this.editInfor.learn_years *= 1;
                this.editInfor.join_year *= 1;
                this.$util.assign(this.formData, this.editInfor);
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
                name: 'members.teacher'
            });
        },
        // switchChange
        changeSwitch() {
            this.formData.status = this.toggleStatus ? 10 : 20;
        },
        // 图片上传成功
        imageUploaded(url) {
            this.formData.avatar = url;
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
            this.formData.start_time = curDateRange[0];
            this.formData.end_time = curDateRange[1];
            this.getData(1);
        },
        // 提交表单
        handleSubmit(name) {
            // 验证通过
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if ('img') {
                        this.$Message.warning('请上传图片');
                        return;
                    }
                    let params = this.$util.filterValue(this.formData, this.paramsFilter);
                    this.$apis.teacherEdit(params).then(res => {
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
            this.$refs.dateRange.handleClear();
            this.$refs.date.handleClear();
            this.toggleStatus = this.editInfor.status == 10;
            this.$refs[name].resetFields();
            if (this.isEdit) {
                this.$util.assign(this.formData, this.editInfor);
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
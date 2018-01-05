<template>
    <div>
        <div class="login-form">
            <div class="login-slogan">
                <img src="../../assets/images/slogan.png" height="105" width="587">
            </div>
            <div class="login-content">
                <input type="text" placeholder="请输入账号" v-model="formData.account" name="account">
                <input type="password" placeholder="请输入密码" v-model="formData.password" name="password">
                <button class="login-btn" @click="handleSubmit">
                    {{loginStaus == 1 ? '登录中...' : '登录'}}
                </button>
            </div>
            <div class="login-copyright">
                Terminus/特斯联人脸识别系统
                <br>深圳市留学生创业大厦
            </div>
        </div>
        <div class="ivu-login-mask"></div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            loginStaus: 0, // 0: 未登录, 1:登录
            formData: {
                account: '',
                password: ''
            }
        }
    },
    mounted() {
        this.setDefault();
    },
    computed: {
        valid() {
            return this.formData.account && this.formData.password;
        }
    },
    methods: {
        setDefault() {
            this.formData.account = Cookies.get('acc') || '';
            this.formData.password = Cookies.get('pass') || '';
        },
        setRemember(status) {
            Cookies.set('acc', this.formData.account, {
                expires: 30
            });
            Cookies.set('pass', this.formData.password, {
                expires: 30
            });
        },
        login() {
            this.formData.status = this.toggleStatus ? 10 : 20;
            this.$apis.login(this.formData).then(res => {

                // 如果为记住密码, 则记住账号 cookie
                this.setRemember(this.remember);

                // 跳转到首页
                this.$router.push({
                    name: 'home'
                });
                this.$Message.success('登录成功!');
            });
        },
        handleSubmit() {
            if (!this.formData.account) {
                this.$Message.warning('请输入用户名!');
                return;
            } else if (!this.formData.password) {
                this.$Message.warning('请输入密码!');
                return;
            } else {
                this.login();
            }
        }
    }
}
</script>
<style>
.login {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.login-form {
    width: 320px;
    height: 230px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    margin-left: -140px;
    margin-top: -200px;
    text-align: center
}

.login-slogan img {
    width: 100%;
    height: auto;
}

.login-content {
    padding-top: 15px;
}

.login-content input {
    color: #373E52;
    outline: none;
    display: block;
    background: none;
    border-width: 1px;
    border-style: solid;
    border-color: #3f465c;
    height: 30px;
    width: 100%;
    padding: 20px 10px;
    margin-top: 10px;
    font-size: 20px;
}

.login-copyright {
    color: #fff;
    position: fixed;
    right: 20px;
    bottom: 20px;
    text-align: right;
}

.login-copyright img {
    width: 100px;
}

.login-btn {
    cursor: pointer;
    outline: none;
    opacity: 0.9;
    transition: all 0.4s;
    margin-top: 20px;
    border: none;
    background-color: #df530a;
    display: block;
    width: 100%;
    color: #fff;
    font-size: 18px;
    height: 40px;
    border-radius: 0;
}

.login-btn:hover {
    opacity: 0.5;
}

.login-btn:active {
    opacity: 1;
}

.ivu-login-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-color: #F1F1F5;
    background-image: url(../../assets/images/admin.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 0 bottom;
    overflow: hidden;
}

.ivu-login-mask {
    animation: mysecond ease-in-out 2.5s;
    -moz-animation: mysecond ease-in-out 2.5s;
    -webkit-animation: mysecond ease-in-out 2.5s;
    -o-animation: mysecond ease-in-out 2.5s;
}

@keyframes mysecond {
    0% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

@-moz-keyframes mysecond {
    0% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

@-webkit-keyframes mysecond {
    0% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

@-o-keyframes mysecond {
    0% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>
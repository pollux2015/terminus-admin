<template>
    <div class="error401">
        <div class="error401-body-con">
            <Card>
                <div class="error401-body-con-title">4<span class="error401-0-span"><Icon type="android-lock"></Icon></span><span class="error401-key-span"><Icon type="key"></Icon></span></div>
                <p class="error401-body-con-message">You don't have permission</p>
                <div class="error401-btn-con">
                    <Button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</Button>
                    <Button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</Button>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Error401',
    methods: {
        backPage() {
            this.$router.go(-1);
        },
        goHome() {
            this.$router.push({
                name: 'home'
            });
        }
    }
};
</script>
<style scoped>
@keyframes error401animation {
    0% {
        transform: rotateZ(0deg);
    }
    40% {
        transform: rotateZ(-20deg);
    }
    45% {
        transform: rotateZ(-15deg);
    }
    50% {
        transform: rotateZ(-20deg);
    }
    55% {
        transform: rotateZ(-15deg);
    }
    60% {
        transform: rotateZ(-20deg);
    }
    100% {
        transform: rotateZ(0deg);
    }
}

.error401 {
    &-body-con {
        width: 700px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &-title {
            text-align: center;
            font-size: 240px;
            font-weight: 700;
            color: #2d8cf0;
            height: 260px;
            line-height: 260px;
            margin-top: 40px;
            .error401-0-span {
                display: inline-block;
                position: relative;
                width: 170px;
                height: 170px;
                border-radius: 50%;
                border: 20px solid #ed3f14;
                color: #ed3f14;
                margin-right: 10px;
                i {
                    display: inline-block;
                    font-size: 120px;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .error401-key-span {
                display: inline-block;
                position: relative;
                width: 100px;
                height: 170px;
                border-radius: 50%;
                margin-right: 10px;
                i {
                    display: inline-block;
                    font-size: 190px;
                    position: absolute;
                    left: 20px;
                    transform: translate(-50%, -50%);
                    transform-origin: center bottom;
                    animation: error401animation 2.8s ease 0s infinite;
                }
            }
        }
        &-message {
            display: block;
            text-align: center;
            font-size: 30px;
            font-weight: 500;
            letter-spacing: 4px;
            color: #dddde2;
        }
    }
    &-btn-con {
        text-align: center;
        padding: 20px 0;
        margin-bottom: 40px;
    }
}
</style>
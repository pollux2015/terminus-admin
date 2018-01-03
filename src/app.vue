<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    computed: {
        mainClient() {
            return this.$store.getters.bodyClient - 150;
        }
    },
    created() {

        // set frame size
        this.$store.commit('bodyClient', document.body.clientHeight);
        window.onresize = () => {
            this.$store.commit('bodyClient', document.body.clientHeight);
        }
    }
};
</script>
<style>
body,
html,
.layout {
    height: 100%;
}


/* tableFuncs */

.tableFuncs {
    text-align: right;
}



/* tableTools */

.tableTools {
    position: relative;
    padding: 15px 0;
}

.tableTools .ivu-form-item {
    margin-bottom: 0;
}

.tableTools .ivu-form-item-label {
    font-weight: 700;
}

.tool-label {
    color: #495060;
    line-height: 30px;
}

.tableTools .btnGroup {
    position: absolute;
    right: 0;
    top: -45px;
}

.ivu-table .disabled-row td {
    background-color: #efefef !important;
}


/* 分页 */

.pagination {
    position: relative;
    padding: 10px 0;
    height: 50px;
}

.pagination .ivu-page {
    float: right;
}

.pagination .ivu-page-total {
    position: absolute;
    left: 0;
}
</style>
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
.top-gap{padding: 20px 0;}

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

/*table-pic*/
.table-pic{
    display: block;
    padding: 10px;
    width: 100%;
}

/*table-pic*/
.table-pic img{
    display: block;
    width: 100%;
}
</style>
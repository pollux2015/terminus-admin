<template>
    <div class="layout">
        <Layout>
            <Header class="layout-header">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">Terminus<span class="layout-logo-rel">/</span><span class="layout-logo-zh">特斯联</span></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                        <Icon type="ios-navigate"></Icon>
                        Item 1
                        </MenuItem>
                        <MenuItem name="2">
                        <Icon type="ios-keypad"></Icon>
                        Item 2
                        </MenuItem>
                        <MenuItem name="3">
                        <Icon type="ios-analytics"></Icon>
                        Item 3
                        </MenuItem>
                        <MenuItem name="4">
                        <Icon type="ios-paper"></Icon>
                        Item 4
                        </MenuItem>
                    </div>
                </Menu>
            </Header>
            <Layout class="layout-main">
                <Breadcrumb class="layout-breadcrumd">
                    <BreadcrumbItem href="/" v-if="routeName != 'home.index'">
                        <Icon type="ios-home-outline"></Icon> 首页
                    </BreadcrumbItem>
                    <BreadcrumbItem :key="item.href" v-for="item in breadcrumb" :href="item.href">
                        {{item.name}}
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        {{metaName}}
                    </BreadcrumbItem>
                </Breadcrumb>
                <Content class="layout-content" :style="{height: mainClient + 'px'}">
                    <router-view></router-view>
                </Content>
            </Layout>
            <Footer class="layout-footer">2011-2016 &copy; TalkingData</Footer>
        </Layout>
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    computed: {
        mainClient(){
            return this.$store.getters.bodyClient - 150;
        },
        breadcrumb() {
            return this.$store.getters.breadcrumb;
        },
        siteName() {
            return this.$store.getters.siteName;
        },
        metaName() {
            return this.$store.getters.metaName;
        },
        routeName() {
            return this.$route.name;
        }
    },
    created() {

        // set frame size
        this.$store.commit('bodyClient', document.body.clientHeight);
        window.onresize = () => {
            this.$store.commit('bodyClient', document.body.clientHeight);
        }
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {

    }
};
</script>
<style>
body,
html,
.layout {
    height: 100%;
}

.layout {
    position: relative;
    overflow: hidden;
    background: #f5f7f9;
}

.layout .layout-header {
    padding: 0;
    height: 60px;
}

.layout .layout-breadcrumd {
    height: 20px;
    margin: 15px 0;
}

.layout .layout-main {
    padding: 0 20px;
}

.layout .layout-content {
    padding: 20px 0;
    min-height: 280px;
    border-radius: 4px;
    background: #fff;
}

.layout .layout-footer {
    height: 40px;
    padding: 10px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
}

.layout .layout-logo {
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
}

.layout-logo-rel,
.layout-logo-zh {
    font-size: 18px;
    font-weight: normal;
}

.layout-logo-rel {
    padding: 0 5px;
}

.layout .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 0;
}
</style>
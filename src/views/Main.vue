<template>
    <div class="layout">
        <Layout>
            <Header class="layout-header">
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">Terminus<span class="layout-logo-rel">/</span><span class="layout-logo-zh">特斯联</span></div>
                    <div class="layout-nav">
                        <span class="nav-item" :class="{active: routeName == menu.url}" :key="menu.id" v-for="menu in menusList" @click="goNav(menu.url)">
                        <Icon :type="menu.icon"></Icon>
                        {{menu.name}}
                        </span>
                    </div>
                    <div class="layout-avater">
                        <Dropdown>
                            <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                            <DropdownMenu slot="list">
                                <DropdownItem>设置</DropdownItem>
                                <DropdownItem>个人资料</DropdownItem>
                                <DropdownItem>退出系统</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
                    <BreadcrumbItem v-if="routeName != 'home'">
                        {{metaName}}
                    </BreadcrumbItem>
                </Breadcrumb>
                <Content class="layout-content" :style="{height: mainClient + 'px'}">
                    <router-view></router-view>
                </Content>
            </Layout>
            <Footer class="layout-footer">{{copyright}}</Footer>
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
        copyright(){
            return this.$store.getters.copyright;
        },
        menusList() {
            return this.$store.getters.menus;
        },
        mainClient() {
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
    methods: {
        goNav(name) {
            this.$router.push({
                name
            });
        }
    }
};
</script>
<style>
.layout {
    position: relative;
    overflow: hidden;
    background: #f5f7f9;
}

.layout .layout-header {
    position: relative;
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
    padding: 0 20px;
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
    position: absolute;
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
    text-align: center;
    margin-right: 20px;
}

.layout-avater {
    position: absolute;
    right: 20px;
    top: 0;
}

.nav-item {
    transition: all 0.2s;
    cursor: pointer;
    font-size: 16px;
    padding: 0 23px;
    display: inline-block;
    color: #fff;
}

.nav-item .ivu-icon {
    position: relative;
    top: 2px;
    margin-right: 2px;
    font-size: 22px;
}

.nav-item:hover{
    background-color: #383f4e;
}

.nav-item.active {
    background: linear-gradient( 45deg, hsla(238, 54%, 49%, 1) 0%, hsla(238, 54%, 49%, 0) 70%), linear-gradient( 135deg, hsla(186, 100%, 57%, 1) 10%, hsla(186, 100%, 57%, 0) 80%), linear-gradient( 225deg, hsla(227, 72%, 48%, 1) 10%, hsla(227, 72%, 48%, 0) 80%), linear-gradient( 315deg, hsla(224, 73%, 55%, 1) 100%, hsla(224, 73%, 55%, 0) 70%);
}
</style>
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
        mainClient(){
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
</style>
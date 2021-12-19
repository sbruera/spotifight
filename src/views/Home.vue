<template>
  <div class="home">
    <Login v-if="!token" />
    <WebPlayback v-else />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import WebPlayback from "@/components/WebPlayback.vue";

export default {
  name: "Home",
  components: {
    Login,
    WebPlayback,
  },
  computed: {
    token() {
      return this.$store.getters.token;
    },
  },
};
</script>

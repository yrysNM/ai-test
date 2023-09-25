<template>
  <div>
    <Navbar />

    <main>
      <div class="container">
        <Nuxt />
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
export default {
  name: "DefaultLayout",
  components: {
    Navbar,
  },
};
</script>

<style lang="scss" scoped></style>

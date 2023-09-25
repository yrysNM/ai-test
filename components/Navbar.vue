<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <nuxt-link
      class="navbar-brand mr-4"
      exact
      aria-current="page"
      active-class="active"
      to="/"
    >
      Nuxt SSR
    </nuxt-link>

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <nuxt-link exact class="nav-link" active-class="active" to="/">
            Home
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link exact class="nav-link" to="/about" active-class="active">
            About
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style lang="scss" scoped></style>

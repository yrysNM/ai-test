<template>
  <section>
    <h1>USER {{ $route.params.id }}</h1>
  </section>
</template>

<script>
export default {
  validate() {
    console.log("validate ");
    return true;
  },
};
</script>

<style lang="scss" scoped></style>

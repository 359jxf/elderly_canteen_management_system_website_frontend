<template>
  <div id="app">  
    <router-view/>  
  </div>
</template>

<script>
export default {
  name: "App",
  props: {
    showNavBar: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
html {
  /* 滚动方式设置为平滑滚动 */
  scroll-behavior: smooth;
}
nav {
  display: flex;
  gap: 10px;
}
</style>

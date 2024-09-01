// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // 引入 Vuex Store

const app = createApp(App);

app.use(router);
app.use(store); // 使用 Vuex Store

app.mount("#app");

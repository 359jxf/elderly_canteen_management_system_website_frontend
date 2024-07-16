import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import OTPLoginPage from "../views/OTPLoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import NewpsdPage from "../views/NewpsdPage.vue";

const routes = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/OTP",
    name: "OTPLoginPage",
    component: OTPLoginPage,
  },
  {
    path: "/home",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage,
  },
  {
    path: "/newpsd",
    name: "NewpsdPage",
    component: NewpsdPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

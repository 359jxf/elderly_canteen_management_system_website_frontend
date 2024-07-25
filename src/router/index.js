import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import OTPLoginPage from "../views/OTPLoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import NewpsdPage from "../views/NewpsdPage.vue";
import MyProfile from "../views/MyProfile.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
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
    props: route => ({ from: route.query.from, phone: route.query.phone }),
  },
  {
    path: "/profile",
    name: "MyProfile",
    component: MyProfile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;



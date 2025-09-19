// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import UserList from "@/views/UserList.vue";
import PortfolioList from "@/views/PortfolioList.vue";
import UserForm from "@/views/UserForm.vue";

const routes = [
  { path: "/", redirect: "/clients" },
  { path: "/clients", component: UserList, name: "clients" },
  { path: "/portfolios", component: PortfolioList, name: "portfolios" },
  { path: "/userForm", component: UserForm, name: "userForm" },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

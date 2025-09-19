// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import UserList from "@/views/UserList.vue";
import PortfolioList from "@/views/PortfolioList.vue";

const routes = [
  { path: "/", redirect: "/users" },
  { path: "/users", component: UserList, name: "users" },
  { path: "/portfolios", component: PortfolioList, name: "portfolios" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

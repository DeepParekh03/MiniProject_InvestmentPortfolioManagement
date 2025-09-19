/* eslint-disable */

<script setup>
import { Users, Briefcase } from "lucide-vue-next";

const navigationItems = [
  { id: "clients", label: "Clients", icon: Users, path: "/clients" },
  { id: "portfolios", label: "Portfolios", icon: Briefcase, path: "/portfolios" },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Side: Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-xl text-gray-900">Portfolio Manager</h1>
        </div>

        <!-- Right Side: Navigation Tabs -->
        <nav class="flex space-x-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.id"
            :to="item.path"
            class="px-4 py-2 h-10 rounded-lg flex items-center space-x-2"
            active-class="bg-blue-50 text-blue-700"
          >
            <component :is="item.icon" class="w-4 h-4" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8 max-w-7xl">
      <router-view />
    </main>
  </div>
</template>

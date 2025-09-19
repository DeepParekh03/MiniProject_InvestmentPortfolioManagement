<!-- src/components/Layout.vue -->
<script setup lang="ts">
import { ref, defineProps } from "vue";
import { Users, Briefcase, Search, Bell } from "lucide-vue-next";

defineProps<{
  activeSection: "users" | "portfolios";
  onSectionChange: (section: "users" | "portfolios") => void;
}>();

const navigationItems = [
  { id: "users" as const, label: "Clients", icon: Users },
  { id: "portfolios" as const, label: "Portfolios", icon: Briefcase },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Side: Logo + Nav -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase class="w-5 h-5 text-white" />
            </div>
            <h1 class="text-xl text-gray-900">Portfolio Manager</h1>
          </div>

          <!-- Navigation Tabs -->
          <nav class="flex space-x-1">
            <button
              v-for="item in navigationItems"
              :key="item.id"
              class="px-4 py-2 h-10 rounded-lg flex items-center space-x-2"
              :class="[
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
              @click="onSectionChange(item.id)"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </div>

        <!-- Right side - search and profile -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              class="pl-10 w-80 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Notifications -->
          <button class="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
            <Bell class="w-5 h-5" />
          </button>

          <!-- Avatar dropdown (basic version without headlessui) -->
          <div class="relative group">
            <button class="relative h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              JD
            </button>
            <div
              class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-md p-2 hidden group-hover:block"
            >
              <div class="px-3 py-2 border-b">
                <p class="text-gray-900">John Doe</p>
                <p class="text-xs text-gray-500">john.doe@company.com</p>
              </div>
              <ul class="py-1">
                <li class="px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer">Profile Settings</li>
                <li class="px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer">Account Settings</li>
              </ul>
              <div class="border-t">
                <div class="px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer">Log out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8 max-w-7xl">
      <slot />
    </main>
  </div>
</template>

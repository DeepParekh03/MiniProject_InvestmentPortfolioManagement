<script setup>
// import { useRoute, useRouter } from "vue-router";
// import { computed } from "vue";
// import Layout from "@/components/Layout.vue";

// const route = useRoute();
// const router = useRouter();

// // derive activeSection from current route
// const activeSection = computed(() => {
//   if (route.name === "users") return "users";
//   if (route.name === "portfolios") return "portfolios";
//   return "users";
// });

// // handle section change (when nav button is clicked)
// function handleSectionChange(section) {
//   router.push({ name: section });
// }
</script>

<template>
<div class="bg-blue-500 p-4">
  <span class="text-red-600">Red text</span>
  <span class="text-white"> White text</span>
</div>

  <!-- <Layout :active-section="activeSection" :on-section-change="handleSectionChange">
    <router-view />
  </Layout> -->
</template>

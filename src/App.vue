<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import Layout from "./components/LayoutComponent.vue";

const route = useRoute();
const router = useRouter();

const activeSection = computed(() => {
  if (route.name === "users") return "users";
  if (route.name === "portfolios") return "portfolios";
  return "users";
});

function handleSectionChange(section) {
  router.push({ name: section });
}
</script>

<template>
<Layout :active-section="activeSection" :on-section-change="handleSectionChange">
    <router-view />
  </Layout>
</template>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl text-gray-900">Portfolios</h1>
      <button 
        @click="onCreatePortfolio"
        class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        <Plus class="w-4 h-4 mr-2" />
        New Portfolio
      </button>
    </div>

    <div class="bg-white rounded-xl shadow">
      <div class="border-b p-4 flex justify-between items-center">
        <h2 class="text-xl text-gray-900">Portfolio Management</h2>
        <div class="relative w-80">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            v-model="searchTerm"
            placeholder="Search portfolios..."
            class="pl-10 border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div class="p-4">
        <div class="grid grid-cols-3 mb-6 gap-2">
          <button
            v-for="status in ['UPCOMING','ACTIVE','CLOSED']"
            :key="status"
            @click="activeTab = status"
            :class="[
              'py-2 rounded-lg text-center',
              activeTab === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ status }}
          </button>
        </div>

        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-2 text-left text-gray-700">Portfolio Name</th>
              <th class="p-2 text-left text-gray-700">Client</th>
              <th class="p-2 text-left text-gray-700">Start Date</th>
              <th class="p-2 text-left text-gray-700">Status</th>
              <th class="p-2 text-left text-gray-700">Returns %</th>
              <th class="p-2 text-left text-gray-700">Value</th>
              <th class="p-2 text-right text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(portfolio, index) in filteredPortfolios" 
              :key="portfolio.id"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
            >
              <td class="p-2 text-gray-900">{{ portfolio.name ?? '-' }}</td>
              <td class="p-2 text-gray-600">{{ portfolio.client ?? '-' }}</td>
              <td class="p-2 text-gray-600">
                {{ portfolio.startDate ? new Date(portfolio.startDate).toLocaleDateString() : '-' }}
              </td>
              <td class="p-2">
                <span :class="getStatusVariant(portfolio.status)" class="px-2 py-1 rounded-lg text-sm font-medium">
                  {{ portfolio.status ?? '-' }}
                </span>
              </td>
              <td class="p-2">
                <span v-if="!portfolio.returns && portfolio.status === 'UPCOMING'" class="text-gray-400">-</span>
                <span v-else v-html="formatPercentage(portfolio.returns ?? 0)"></span>  
              </td>
              <td class="p-2 text-gray-900">{{ formatCurrency(portfolio.totalValue ?? 0) }}</td>
              <td class="p-2 text-right">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="onViewPortfolio(portfolio.id)"
                    class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click="onEditPortfolio(portfolio.id)"
                    class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPortfolios.length === 0">
              <td colspan="7" class="text-center py-4 text-gray-500">No portfolios found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Eye, Edit, Plus, Search } from "lucide-vue-next";

const store = useStore();
const router = useRouter();

const searchTerm = ref("");
const activeTab = ref("ACTIVE");

const filteredPortfolios = computed(() => {
  const allPortfolios = store.getters.getPortfolios ?? [];
  return allPortfolios.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ?? false;
    const matchesStatus = p.status === activeTab.value;
    return matchesSearch && matchesStatus;
  });
});

const onViewPortfolio = (id) => router.push({ path: "/portfolioDetail", query: { id } });
const onEditPortfolio = (id) => router.push({ path: "/portfolioForm", query: { id } });
const onCreatePortfolio = () => router.push("/portfolioForm");

const getStatusVariant = (status) => {
  switch (status) {
    case "ACTIVE": return "bg-green-100 text-green-800";
    case "UPCOMING": return "bg-blue-100 text-blue-800";
    case "CLOSED": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-200 text-gray-700";
  }
};

const formatCurrency = (amount) => {
  if (!amount) amount = 0;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);
};

const formatPercentage = (percentage) => {
  if (!percentage && percentage !== 0) percentage = 0;
  const isPositive = percentage >= 0;
  return `<span class="${isPositive ? "text-green-600" : "text-red-600"}">
    ${isPositive && percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%
  </span>`;
};

</script>


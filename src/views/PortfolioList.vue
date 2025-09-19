
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
        <div class="grid grid-cols-3 mb-6">
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
              <td class="p-2 text-gray-900">{{ portfolio.name }}</td>
              <td class="p-2 text-gray-600">{{ portfolio.client }}</td>
              <td class="p-2 text-gray-600">{{ new Date(portfolio.startDate).toLocaleDateString() }}</td>
              <td class="p-2">
                <span :class="getStatusVariant(portfolio.status)" class="px-2 py-1 rounded-lg text-sm font-medium">
                  {{ portfolio.status }}
                </span>
              </td>
              <td class="p-2">
                <span v-if="portfolio.status === 'UPCOMING'" class="text-gray-400">-</span>
                <span v-else v-html="formatPercentage(portfolio.returns)"></span>
              </td>
              <td class="p-2 text-gray-900">{{ formatCurrency(portfolio.totalValue) }}</td>
              <td class="p-2 text-right">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="onViewPortfolio(portfolio)"
                    class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    @click="onEditPortfolio(portfolio)"
                    class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Eye, Edit, Plus, Search, TrendingUp, TrendingDown } from "lucide-vue-next";

const props = defineProps({
  onEditPortfolio: Function,
  onViewPortfolio: Function,
  onCreatePortfolio: Function,
});

const searchTerm = ref("");
const activeTab = ref("ACTIVE");

//dummy portfolios
const mockPortfolios = [
  { id: "1", name: "Growth Portfolio", client: "John Smith", startDate: "2023-01-15", status: "ACTIVE", returns: 12.5, totalValue: 150000 },
  { id: "2", name: "Conservative Portfolio", client: "Sarah Johnson", startDate: "2023-03-20", status: "ACTIVE", returns: 8.2, totalValue: 85000 },
  { id: "3", name: "Aggressive Growth", client: "Michael Chen", startDate: "2024-01-10", status: "UPCOMING", returns: 0, totalValue: 75000 },
  { id: "4", name: "Retirement Portfolio", client: "Emma Wilson", startDate: "2022-06-15", status: "CLOSED", returns: 15.8, totalValue: 120000 },
  { id: "5", name: "Balanced Portfolio", client: "David Brown", startDate: "2023-09-01", status: "ACTIVE", returns: -2.1, totalValue: 95000 },
];

const filteredPortfolios = computed(() =>
  mockPortfolios.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesTab = activeTab.value === "all" || p.status === activeTab.value;
    return matchesSearch && matchesTab;
  })
);

const getStatusVariant = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "UPCOMING":
      return "bg-blue-100 text-blue-800";
    case "CLOSED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

const formatPercentage = (percentage) => {
  const isPositive = percentage >= 0;
  return `
    <span class="flex items-center ${isPositive ? "text-green-600" : "text-red-600"}">
      ${isPositive 
        ? `<svg class='w-3 h-3 mr-1' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path d='M12 4v16m8-8H4'/></svg>`
        : `<svg class='w-3 h-3 mr-1' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path d='M20 12H4m8-8v16'/></svg>`
      }
      ${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%
    </span>
  `;
};
</script>

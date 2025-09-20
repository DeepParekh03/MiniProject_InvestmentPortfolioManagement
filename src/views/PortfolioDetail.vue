<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl text-gray-900">{{ portfolio.name }}</h1>
      <div class="flex space-x-3">
        <button @click="onEdit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          ✏️ Edit Portfolio
        </button>
        <button v-if="portfolio.status === 'ACTIVE'" @click="onClose"
          class="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
          ❌ Close Portfolio
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="p-4 border rounded shadow">
        <h2 class="text-lg font-semibold text-gray-900">Client Information</h2>
        <p class="mt-2 text-gray-900 py-3">{{ portfolio.client }}</p>
        <p class="text-sm text-gray-600 py-2">📧 {{ clientDetails?.email }}</p>
        <p class="text-sm text-gray-600 py-2">📞 {{ clientDetails?.phone }}</p>
      </div>
      <div class="p-4 border rounded shadow lg:col-span-2">
        <h2 class="text-lg font-semibold text-gray-900">Portfolio Summary</h2>
        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <span :class="getStatusVariant(portfolio.status)" class="px-2 py-1 text-sm rounded">
              {{ portfolio.status }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-500">Start Date</p>
            <p class="text-gray-900">{{ formatDate(portfolio.startDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Investment</p>
            <p class="text-gray-900">{{ formatCurrency(totalInvestment) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Current Value</p>
            <p class="text-gray-900">{{ formatCurrency(totalValue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border rounded shadow">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Portfolio Distribution</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApexCharts type="pie" :series="pieSeries" :options="pieOptions" height="300" />

        <ApexCharts type="bar" :series="barSeries" :options="barOptions" height="300" />
      </div>
    </div>

    <div class="p-4 border rounded shadow">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Holdings</h2>
      <table class="min-w-full border text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-2 border">Asset</th>
            <th class="px-4 py-2 border">Type</th>
            <th class="px-4 py-2 border">Allocation %</th>
            <th class="px-4 py-2 border">Current Value</th>
            <th class="px-4 py-2 border">Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(holding, index) in holdingsWithGainLoss" :key="holding.id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
            <td class="px-4 py-2 border">{{ holding.asset }}</td>
            <td class="px-4 py-2 border">{{ holding.type }}</td>
            <td class="px-4 py-2 border">{{ holding.allocation }}%</td>
            <td class="px-4 py-2 border">{{ formatCurrency(holding.currentValue) }}</td>
            <td class="px-4 py-2 border" v-html="formatPercentage(holding.gainLoss)"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import ApexCharts from "vue3-apexcharts";

const router = useRouter();
const route = useRoute();
const store = useStore();

const portfolioId = route.query.id;
const portfolio = computed(() => store.getters.getPortfolioById(portfolioId));
const clientDetails = computed(() => store.getters.getClients.find(c => c.name === portfolio.value?.client));

const totalInvestment = computed(() =>
  portfolio.value?.holdings?.reduce((sum, h) => sum + h.initialValue, 0) ?? 0
);

const totalValue = computed(() =>
  portfolio.value?.holdings?.reduce((sum, h) => sum + h.currentValue, 0) ?? 0
);

const holdingsWithGainLoss = computed(() =>
  portfolio.value?.holdings?.map(h => ({
    ...h,
    gainLoss: h.initialValue > 0 ? ((h.currentValue - h.initialValue) / h.initialValue) * 100 : 0
  })) || []
);

const groupedHoldings = computed(() => {
  const groups = {};
  portfolio.value?.holdings?.forEach(h => {
    groups[h.type] = (groups[h.type] || 0) + h.currentValue;
  });
  return groups;
});

const pieSeries = computed(() => Object.values(groupedHoldings.value || {}));
const pieOptions = computed(() => ({
  labels: Object.keys(groupedHoldings.value || {}),
  legend: { position: "bottom" },
  colors: ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#9333ea"],
}));

const barSeries = computed(() => [{
  name: "Current Value",
  data: Object.values(groupedHoldings.value || {}),
}]);
const barOptions = computed(() => ({
  chart: { type: "bar" },
  xaxis: { categories: Object.keys(groupedHoldings.value || {}) },
  plotOptions: { bar: { distributed: true } },
  dataLabels: { enabled: true },
}));

const getStatusVariant = (status) => {
  switch (status) {
    case "ACTIVE": return "bg-green-100 text-green-800";
    case "UPCOMING": return "bg-blue-100 text-blue-800";
    case "CLOSED": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-200";
  }
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

const formatDate = (date) => new Date(date).toLocaleDateString();

const formatPercentage = (pct) => {
  const value = Number.isFinite(pct) ? pct : 0;
  const positive = value >= 0;
  return `<span class='${positive ? "text-green-600" : "text-red-600"}'>
    ${positive ? "▲" : "▼"} ${value > 0 ? "+" : ""}${value.toFixed(1)}%</span>`;
};

const onEdit = () => alert("Edit clicked!");

const onClose = async () => {
  if (!portfolio.value) return;

  const totalInitialInvestment = portfolio.value.holdings?.reduce(
    (sum, h) => sum + (h.initialValue || 0),
    0
  ) ?? 0;

  const totalCurrentValue = portfolio.value.holdings?.reduce(
    (sum, h) => sum + (h.currentValue || 0),
    0
  ) ?? 0;

  const portfolioData = {
    id: portfolio.value.id,
    name: portfolio.value.name,
    client: portfolio.value.client,
    startDate: portfolio.value.startDate,
    status: "CLOSED",
    notes: portfolio.value.notes,
    holdings: portfolio.value.holdings?.map(h => ({
      id: h.id,
      asset: h.asset,
      type: h.type,
      allocation: h.allocation,
      initialValue: h.initialValue,
      currentValue: h.currentValue,
    })) || [],
    totalValue: totalCurrentValue,
    returns: totalInitialInvestment > 0
      ? ((totalCurrentValue - totalInitialInvestment) / totalInitialInvestment) * 100
      : 0,
  };

  await store.dispatch("savePortfolio", portfolioData);
  router.push("/portfolios");
};

</script>

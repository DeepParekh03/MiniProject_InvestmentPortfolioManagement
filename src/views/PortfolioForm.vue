<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow">
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h2 class="text-2xl text-gray-900">{{ isEditing ? "Edit Portfolio" : "Create New Portfolio" }}</h2>
        <button class="text-gray-500 hover:text-gray-700" @click="onCancel">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form class="p-6 space-y-8" @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <h3 class="text-lg text-gray-900">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700">Portfolio Name *</label>
              <input v-model="formData.name" type="text" placeholder="Enter portfolio name"
                class="w-full border rounded px-3 py-2" :class="{ 'border-red-500': errors.name }" />
              <p v-if="errors.name" class="text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label class="block text-gray-700">Client *</label>
              <select v-model="formData.client" class="w-full border rounded px-3 py-2"
                :class="{ 'border-red-500': errors.client }">
                <option value="" disabled>Select client</option>
                <option v-for="client in mockClients" :key="client.id" :value="client">
                  {{ client.name }}
                </option>
              </select>
              <p v-if="errors.client" class="text-sm text-red-600">{{ errors.client }}</p>
            </div>

            <div>
              <label class="block text-gray-700">Start Date *</label>
              <input v-model="formData.startDate" type="date" class="w-full border rounded px-3 py-2"
                :class="{ 'border-red-500': errors.startDate }" />
              <p v-if="errors.startDate" class="text-sm text-red-600">{{ errors.startDate }}</p>
            </div>

            <div>
              <label class="block text-gray-700">Status *</label>
              <select v-model="formData.status" class="w-full border rounded px-3 py-2">
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700">Notes</label>
              <textarea v-model="formData.notes" rows="3" placeholder="Additional notes..."
                class="w-full border rounded px-3 py-2"></textarea>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg text-gray-900">Holdings</h3>
            <button type="button"
              class="flex items-center px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              @click="addHolding" :disabled="formData.status === 'UPCOMING'">
              <Plus class="w-4 h-4 mr-2" /> Add Holding
            </button>
          </div>

          <p v-if="errors.holdings" class="text-sm text-red-600">{{ errors.holdings }}</p>

          <table v-if="holdings.length > 0" class="w-full border rounded">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-3 py-2 text-left">Asset Name</th>
                <th class="px-3 py-2 text-left">Type</th>
                <th class="px-3 py-2 text-left">Allocation %</th>
                <th class="px-3 py-2 text-left">Initial Value</th>
                <th class="px-3 py-2 text-left">Current Value</th>
                <th class="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(holding, index) in holdings" :key="holding.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
                <td class="px-3 py-2">
                  <input v-model="holding.assetName" type="text" placeholder="e.g., AAPL" class="w-full border rounded px-2 py-1" />
                </td>
                <td class="px-3 py-2">
                  <select v-model="holding.type" class="w-full border rounded px-2 py-1">
                    <option value="Stock">Stock</option>
                    <option value="Bond">Bond</option>
                    <option value="Mutual Fund">Mutual Fund</option>
                    <option value="ETF">ETF</option>
                  </select>
                </td>
                <td class="px-3 py-2">
                  <input v-model.number="holding.allocation" type="number" placeholder="eg. 10" min="0" max="100" step="0.1"
                    class="w-full border rounded px-2 py-1" />
                </td>
                <td class="px-3 py-2">
                  <input v-model.number="holding.initialValue" type="number" placeholder="e.g., 10000" min="0"
                    class="w-full border rounded px-2 py-1" />
                </td>
                <td class="px-3 py-2">
                  <input v-model.number="holding.currentValue" type="number" placeholder="e.g., 11000" min="0"
                    class="w-full border rounded px-2 py-1" />
                </td>
                <td class="px-3 py-2 text-center">
                  <button type="button" class="text-red-600 hover:text-red-700" @click="removeHolding(holding.id)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end space-x-4 pt-6">
          <button type="button" class="px-6 py-2 border rounded" @click="onCancel">Cancel</button>
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {{ isEditing ? "Update Portfolio" : "Save Portfolio" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { X, Plus, Trash2 } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const route = useRoute();

const mockClients = computed(() => store.getters.getClients);

const formData = reactive({
  id: null,
  name: "",
  client: null,
  startDate: "",
  status: "UPCOMING",
  notes: "",
});

const holdings = ref([]);
const errors = reactive({});
const isEditing = computed(() => !!formData.id);

onMounted(() => {
  const portfolioId = route.query.id;
  if (portfolioId) {
    const existingPortfolio = store.getters.getPortfolioById(portfolioId);
    if (existingPortfolio) {
      formData.id = existingPortfolio.id;
      formData.name = existingPortfolio.name;
      formData.client = mockClients.value.find(c => c.name === existingPortfolio.client) || null;
      formData.startDate = existingPortfolio.startDate;
      formData.status = existingPortfolio.status || "UPCOMING";
      formData.notes = existingPortfolio.notes || "";

      holdings.value = existingPortfolio.holdings.map(h => ({
        id: h.id,
        assetName: h.asset,
        type: h.type,
        allocation: h.allocation,
        initialValue: h.initialValue ?? h.currentValue,
        currentValue: h.currentValue,
      }));
    }
  }
});

const validateForm = () => {
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = "Portfolio name is required";
  if (!formData.client) newErrors.client = "Client selection is required";
  if (!formData.startDate) newErrors.startDate = "Start date is required";

  if (holdings.value.length === 0 && formData.status !== "UPCOMING") {
    newErrors.holdings = "At least one holding is required";
  } else if (totalAllocation.value !== 100) {
    newErrors.holdings = `Total allocation must equal 100% (currently ${totalAllocation.value}%)`;
  }

  Object.keys(errors).forEach(key => delete errors[key]);
  Object.assign(errors, newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const totalValue = holdings.value.reduce((sum, h) => sum + Number(h.currentValue || 0), 0);

  const portfolioData = {
    id: formData.id,
    name: formData.name,
    clientId: formData.client.id,
    client: formData.client.name,
    startDate: formData.startDate,
    status: formData.status,
    notes: formData.notes,
    holdings: holdings.value.map(h => ({
      id: h.id,
      asset: h.assetName,
      type: h.type,
      allocation: h.allocation,
      initialValue: h.initialValue,
      currentValue: h.currentValue,
    })),
    totalValue,
    returns: ((totalValue - holdings.value.reduce((sum, h) => sum + h.initialValue, 0)) /
              holdings.value.reduce((sum, h) => sum + h.initialValue, 0)) * 100,
  };

  await store.dispatch("savePortfolio", portfolioData);
  router.push("/portfolios");
};

const onCancel = () => router.push("/portfolios");

const addHolding = () => {
  holdings.value.push({
    id: Date.now().toString(),
    assetName: "",
    type: "Stock",
    allocation: 0,
    initialValue: 0,
    currentValue: 0,
  });
};

const removeHolding = (id) => {
  holdings.value = holdings.value.filter(h => h.id !== id);
};

const totalAllocation = computed(() => holdings.value.reduce((sum, h) => sum + Number(h.allocation || 0), 0));
</script>

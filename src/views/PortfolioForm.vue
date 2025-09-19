<script setup>
import { ref, reactive,computed, watch, onMounted } from "vue";
import { X, Plus, Trash2 } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router= useRouter();
// Props
const props = defineProps({
  portfolio: {
    type: Object,
    default: null,
  },
  onSave: {
    type: Function,
    required: true,
  },

});

// Mock Clients
const mockClients = [
  "John Smith",
  "Sarah Johnson",
  "Michael Chen",
  "Emma Wilson",
  "David Brown",
];

// State
const formData = reactive({
  name: "",
  client: "",
  startDate: "",
  status: "UPCOMING",
  initialInvestment: 0,
  notes: "",
});

const holdings = ref([]);
const errors = reactive({});

// Sync props → form data
onMounted(() => {
  if (props.portfolio) {
    formData.name = props.portfolio.name || "";
    formData.client = props.portfolio.client || "";
    formData.startDate = props.portfolio.startDate || "";
    formData.status = props.portfolio.status || "UPCOMING";
    formData.initialInvestment = props.portfolio.initialInvestment || 0;
    formData.notes = props.portfolio.notes || "";
    holdings.value = props.portfolio.holdings || [];
  }
});

// Validation
const validateForm = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Portfolio name is required";
  }
  if (!formData.client) {
    newErrors.client = "Client selection is required";
  }
  if (!formData.startDate) {
    newErrors.startDate = "Start date is required";
  }
  if (formData.initialInvestment <= 0) {
    newErrors.initialInvestment = "Initial investment must be greater than 0";
  }

  const totalAllocation = computed(() =>
  holdings.value.reduce((sum, h) => sum + Number(h.allocation || 0), 0)
);
  
  if (holdings.value.length > 0 && Math.abs(totalAllocation.value - 100) > 0.01) {
    newErrors.holdings = "Total allocation must equal 100%";
  }

  Object.keys(errors).forEach((key) => delete errors[key]);
  Object.assign(errors, newErrors);

  return Object.keys(newErrors).length === 0;
};

// Form submit
const handleSubmit = () => {
  if (validateForm()) {
    props.onSave({
      ...formData,
      holdings: holdings.value,
    });
  }
};

const onCancel=()=>{
 router.push('/portfolios')
}
// Update fields
const handleInputChange = (field, value) => {
  formData[field] = value;
  if (errors[field]) {
    delete errors[field];
  }
};

// Holdings logic
const addHolding = () => {
  holdings.value.push({
    id: Date.now().toString(),
    assetName: "",
    type: "Stock",
    allocation: 0,
    value: 0,
  });
};

const updateHolding = (id, field, value) => {
  holdings.value = holdings.value.map((h) =>
    h.id === id ? { ...h, [field]: value } : h
  );
  if (errors.holdings) delete errors.holdings;
};

const removeHolding = (id) => {
  holdings.value = holdings.value.filter((h) => h.id !== id);
};

const totalAllocation = computed(() => {
  const list = holdings.value;   // ✅ unwrap once
  return list.reduce((sum, h) => sum + Number(h.allocation || 0), 0);
});

</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b">
        <h2 class="text-2xl text-gray-900">
          {{ props.portfolio ? "Edit Portfolio" : "Create New Portfolio" }}
        </h2>
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="onCancel"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <form
        class="p-6 space-y-8"
        @submit.prevent="handleSubmit"
      >
        <!-- Basic Info -->
        <div class="space-y-6">
          <h3 class="text-lg text-gray-900">
            Basic Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label class="block text-gray-700">Portfolio Name *</label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Enter portfolio name"
                class="w-full border rounded px-3 py-2"
                :class="{ 'border-red-500': errors.name }"
              >
              <p
                v-if="errors.name"
                class="text-sm text-red-600"
              >
                {{ errors.name }}
              </p>
            </div>

            <!-- Client -->
            <div>
              <label class="block text-gray-700">Client *</label>
              <select
                v-model="formData.client"
                class="w-full border rounded px-3 py-2"
                :class="{ 'border-red-500': errors.client }"
              >
                <option value="">
                  Select a client
                </option>
                <option
                  v-for="c in mockClients"
                  :key="c"
                  :value="c"
                >
                  {{ c }}
                </option>
              </select>
              <p
                v-if="errors.client"
                class="text-sm text-red-600"
              >
                {{ errors.client }}
              </p>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-gray-700">Start Date *</label>
              <input
                v-model="formData.startDate"
                type="date"
                class="w-full border rounded px-3 py-2"
                :class="{ 'border-red-500': errors.startDate }"
              >
              <p
                v-if="errors.startDate"
                class="text-sm text-red-600"
              >
                {{ errors.startDate }}
              </p>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-gray-700">Status *</label>
              <select
                v-model="formData.status"
                class="w-full border rounded px-3 py-2"
              >
                <option value="UPCOMING">
                  Upcoming
                </option>
                <option value="ACTIVE">
                  Active
                </option>
                <option value="CLOSED">
                  Closed
                </option>
              </select>
            </div>

            <!-- Investment -->
            <div>
              <label class="block text-gray-700">Initial Investment *</label>
              <input
                v-model.number="formData.initialInvestment"
                type="number"
                placeholder="Enter amount"
                class="w-full border rounded px-3 py-2"
                :class="{ 'border-red-500': errors.initialInvestment }"
              >
              <p
                v-if="errors.initialInvestment"
                class="text-sm text-red-600"
              >
                {{ errors.initialInvestment }}
              </p>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-gray-700">Notes</label>
            <textarea
              v-model="formData.notes"
              rows="3"
              placeholder="Additional notes..."
              class="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <!-- Holdings -->
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg text-gray-900">
                Holdings
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Total Allocation: {{ totalAllocation.toFixed(1) }}%
                <span
                  v-if="totalAllocation !== 100 && holdings.length > 0"
                  class="text-red-600 ml-2"
                >
                  (Must equal 100%)
                </span>
              </p>
            </div>
            <button
              type="button"
              class="flex items-center px-3 py-1 border rounded text-sm"
              @click="addHolding"
            >
              <Plus class="w-4 h-4 mr-2" /> Add Holding
            </button>
          </div>

          <p
            v-if="errors.holdings"
            class="text-sm text-red-600"
          >
            {{ errors.holdings }}
          </p>

          <table
            v-if="holdings.length > 0"
            class="w-full border rounded"
          >
            <thead>
              <tr class="bg-gray-50">
                <th class="px-3 py-2 text-left">
                  Asset Name
                </th>
                <th class="px-3 py-2 text-left">
                  Type
                </th>
                <th class="px-3 py-2 text-left">
                  Allocation %
                </th>
                <th class="px-3 py-2 text-left">
                  Value
                </th>
                <th class="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(holding, index) in holdings"
                :key="holding.id"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
              >
                <td class="px-3 py-2">
                  <input
                    v-model="holding.assetName"
                    type="text"
                    placeholder="e.g., AAPL"
                    class="w-full border rounded px-2 py-1"
                  >
                </td>
                <td class="px-3 py-2">
                  <select
                    v-model="holding.type"
                    class="w-full border rounded px-2 py-1"
                  >
                    <option value="Stock">
                      Stock
                    </option>
                    <option value="Bond">
                      Bond
                    </option>
                    <option value="Mutual Fund">
                      Mutual Fund
                    </option>
                    <option value="ETF">
                      ETF
                    </option>
                  </select>
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="holding.allocation"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full border rounded px-2 py-1"
                  >
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model.number="holding.value"
                    type="number"
                    min="0"
                    class="w-full border rounded px-2 py-1"
                  >
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-700"
                    @click="removeHolding(holding.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            class="px-6 py-2 border rounded"
            @click="onCancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {{ props.portfolio ? "Update Portfolio" : "Save Portfolio" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

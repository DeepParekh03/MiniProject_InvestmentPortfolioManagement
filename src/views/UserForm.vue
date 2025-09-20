<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b px-6 py-4">
        <h2 class="text-2xl font-semibold text-gray-900">
          {{ formData.id ? "Edit Client" : "Add New Client" }}
        </h2>
        <button @click="handleCancel" class="text-gray-500 hover:text-gray-700">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit="handleSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter client's full name"
              class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              :class="errors.name ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.name" class="text-sm text-red-600 mt-1">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter email address"
              class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              :class="errors.email ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.email" class="text-sm text-red-600 mt-1">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="text"
              placeholder="9372538821"
              class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              :class="errors.phone ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.phone" class="text-sm text-red-600 mt-1">
              {{ errors.phone }}
            </p>
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              v-model="formData.status"
              class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <input
            id="address"
            v-model="formData.address"
            type="text"
            placeholder="Enter full address"
            class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
            :class="errors.address ? 'border-red-500' : 'border-gray-300'"
          />
          <p v-if="errors.address" class="text-sm text-red-600 mt-1">
            {{ errors.address }}
          </p>
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            v-model="formData.notes"
            rows="4"
            placeholder="Add any additional notes..."
            class="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {{ formData.id ? "Update Client" : "Save Client" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { X } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const formData = reactive({
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
  notes: "",
});

const errors = reactive({});

watch(
  () => route.query,
  (q) => {
    formData.id = q.id || "";
    formData.name = q.name || "";
    formData.email = q.email || "";
    formData.phone = q.phone || "";
    formData.address = q.address || "";
    formData.status = q.status || "Active";
    formData.notes = q.notes || "";
  },
  { immediate: true }
);

function validateForm() {
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.email.trim()) newErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter valid email";
  if (!formData.phone.trim()) newErrors.phone = "Phone is required";
  else if (formData.phone.length !== 10) newErrors.phone = "Enter valid phone number";
  if (!formData.address.trim()) newErrors.address = "Address is required";

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
}

function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  store.dispatch("saveClient", { ...formData });

  router.push({ name: "clients" });
}

function handleCancel() {
  router.push({ name: "clients" });
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 class="text-3xl text-gray-900">Clients</h1>
      <button
        @click="goToCreateClient"
        class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg self-start sm:self-auto"
      >
        <Plus class="w-4 h-4 mr-2" />
        Add Client
      </button>
    </div>

    <div class="bg-white rounded-xl shadow">
      <div class="border-b p-4 flex flex-col sm:flex-row justify-between gap-4">
        <h2 class="text-xl text-gray-900">Client Management</h2>
        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            v-model="searchTerm"
            placeholder="Search clients..."
            class="pl-10 border rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div class="p-4">
        <div class="hidden md:block">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="p-2 text-left text-gray-700">Name</th>
                <th class="p-2 text-left text-gray-700">Email</th>
                <th class="p-2 text-left text-gray-700">Phone</th>
                <th class="p-2 text-left text-gray-700">Status</th>
                <th class="p-2 text-right text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(client, index) in filteredClients"
                :key="client.id"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'"
              >
                <td class="p-2 text-gray-900">{{ client.name }}</td>
                <td class="p-2 text-gray-600">{{ client.email }}</td>
                <td class="p-2 text-gray-600">{{ client.phone }}</td>
                <td class="p-2">
                  <span
                    :class="getStatusVariant(client.status)"
                    class="px-2 py-1 rounded-lg text-sm font-medium"
                  >
                    {{ client.status }}
                  </span>
                </td>
                <td class="p-2 text-right">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editClient(client)"
                      class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="handleDeleteClient(client.id)"
                      class="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredClients.length === 0">
                <td colspan="5" class="text-center py-4 text-gray-500">
                  No clients currently.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
          <div
            v-for="client in filteredClients"
            :key="client.id"
            class="border rounded-xl p-4 shadow-sm bg-white space-y-3"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">{{ client.name }}</h3>
              <span
                :class="getStatusVariant(client.status)"
                class="px-2 py-1 rounded-lg text-xs font-medium"
              >
                {{ client.status }}
              </span>
            </div>
            <p class="text-gray-600 text-sm">
              <strong>Email:</strong> {{ client.email }}
            </p>
            <p class="text-gray-600 text-sm">
              <strong>Phone:</strong> {{ client.phone }}
            </p>
            <div class="flex justify-end space-x-3 pt-2">
              <button
                @click="editClient(client)"
                class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
              >
                <Edit class="w-4 h-4" />
              </button>
              <button
                @click="handleDeleteClient(client.id)"
                class="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <p v-if="filteredClients.length === 0" class="text-center text-gray-500">
            No clients currently.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Eye, Edit, Trash2, Plus, Search } from "lucide-vue-next";

const store = useStore();
const router = useRouter();

const searchTerm = ref("");

const filteredClients = computed(() =>
  store.getters.filteredClients(searchTerm.value)
);

const goToCreateClient = () => {
  router.push("/userForm");
};

const handleDeleteClient = (clientId) => {
  store.dispatch("removeClient", clientId);
};
const editClient = (client) => {
  router.push({
    name: "userForm",
    query: {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address ?? "",
      clientType: client.clientType ?? "Individual",
      notes: client.notes ?? "",
    },
  });
};
const getStatusVariant = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
};
</script>

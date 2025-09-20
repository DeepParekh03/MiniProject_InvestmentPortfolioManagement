import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import Clients from "@/views/UserList.vue";
import { Plus, Edit, Trash2, Search } from "lucide-vue-next";

const store = createStore({
  getters: {
    filteredClients: () => () => [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", status: "Active" },
    ],
  },
  actions: {
    removeClient: jest.fn(),
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe("ClientsList.vue basic tests", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(Clients, {
      global: {
        plugins: [store, router],
        components: { Plus, Edit, Trash2, Search },
      },
    });
    await router.isReady(); 
  });

  it("renders header and Add Client button", () => {
    expect(wrapper.text()).toContain("Clients");
    expect(wrapper.find("button").text()).toContain("Add Client");
  });

  it("renders client rows from store", () => {
    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].text()).toContain("John Doe");
  });
});

import { mount } from "@vue/test-utils";
import PortfolioForm from "@/views/PortfolioForm.vue";
import { createStore } from "vuex";

jest.mock("vue-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useRoute: () => ({ query: {} }),
}));

describe("PortfolioForm.vue", () => {
  let store;

  beforeEach(() => {
    store = createStore({
      getters: {
        getClients: () => [
          { id: "1", name: "John Doe" },
          { id: "2", name: "Jane Smith" },
        ],
      },
      actions: {
        savePortfolio: jest.fn(),
      },
    });
  });

  it("renders basic form fields", () => {
    const wrapper = mount(PortfolioForm, {
      global: { plugins: [store] },
    });

    expect(
      wrapper.find("input[placeholder='Enter portfolio name']").exists()
    ).toBe(true);
    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("disables Add Holding button when status is UPCOMING", async () => {
    const wrapper = mount(PortfolioForm, {
      global: { plugins: [store] },
    });

    const addButton = wrapper.get('[data-testid="add-holding-btn"]');
    const statusSelect = wrapper.get('[data-testid="status-select"]');

    expect(addButton.element.disabled).toBe(true);

    await statusSelect.setValue("ACTIVE");

    expect(addButton.element.disabled).toBe(false);
  });
});

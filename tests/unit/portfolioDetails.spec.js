import { mount } from "@vue/test-utils";
import PortfolioDetail from "@/views/PortfolioDetail.vue";
import { createStore } from "vuex";

jest.mock("vue-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useRoute: () => ({ query: { id: "123" } }),
}));

jest.mock("vue3-apexcharts", () => ({
  default: {
    template: "<div />", 
  },
}));

describe("PortfolioDetails.vue", () => {
  let store;

  beforeEach(() => {
    store = createStore({
      getters: {
        getPortfolioById: () => () => ({
          id: "123",
          name: "Test Portfolio",
          status: "ACTIVE",
          client: "John Doe",
        }),
        getClients: () => [{ name: "John Doe", email: "john@example.com" }],
      },
    });
  });

  it("renders portfolio name and client details", () => {
    const wrapper = mount(PortfolioDetail, {
      global: { plugins: [store] },
    });

    expect(wrapper.text()).toContain("Test Portfolio");
    expect(wrapper.text()).toContain("John Doe");
  });

  it("displays the correct portfolio status", () => {
    const wrapper = mount(PortfolioDetail, {
      global: { plugins: [store] },
    });

    expect(wrapper.text()).toContain("ACTIVE");
  });
});

import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import Portfolios from "@/views/PortfolioList.vue";
import { Plus, Eye, Edit, Search } from "lucide-vue-next";

const store = createStore({
  getters: {
    getPortfolios: () => [
      {
        id: 1,
        name: "Portfolio A",
        client: "Client 1",
        startDate: "2025-01-01",
        status: "ACTIVE",
        returns: 5,
        totalValue: 10000,
      },
    ],
  },
});

const mockRouter = {
  push: jest.fn(),
};

describe("Portfolios.vue basic tests", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Portfolios, {
      global: {
        provide: {
          store,
          router: mockRouter,
        },
        components: { Plus, Eye, Edit, Search },
      },
    });
  });

  it("renders header and new portfolio button", () => {
    expect(wrapper.text()).toContain("Portfolios");
    const newButton = wrapper.find("button");
    expect(newButton.text()).toContain("New Portfolio");
  });

  it("renders portfolio rows from store", () => {
    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].text()).toContain("Portfolio A");
  });
});

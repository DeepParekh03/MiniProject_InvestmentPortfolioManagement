import { createStore } from "vuex";

export default createStore({
  state: {
    clients: [
      { id: "1", name: "John Smith", email: "john.smith@email.com", phone: "9372532881", status: "Active" },
      { id: "2", name: "Sarah Johnson", email: "sarah.johnson@email.com", phone: "9312532881", status: "Active" },
      { id: "3", name: "Michael Chen", email: "michael.chen@email.com", phone: "9372572881", status: "Pending" },
      { id: "4", name: "Emma Wilson", email: "emma.wilson@email.com", phone: "9372532800", status: "Inactive" },
      { id: "5", name: "David Brown", email: "david.brown@email.com", phone: "9372232881", status: "Active" },
    ],

    portfolios: [
      {
        id: "1",
        name: "Growth Portfolio",
        client: "John Smith",
        startDate: "2023-01-15",
        status: "ACTIVE",
        returns: 12.5,
        totalValue: 150000,
        holdings: [
          { id: "1", asset: "AAPL", type: "Stock", allocation: 25, initialValue: 30000, currentValue: 37500 },
          { id: "2", asset: "MSFT", type: "Stock", allocation: 20, initialValue: 25000, currentValue: 30000 },
          { id: "3", asset: "VTI", type: "ETF", allocation: 30, initialValue: 35000, currentValue: 45000 },
          { id: "4", asset: "BND", type: "Bond", allocation: 15, initialValue: 20000, currentValue: 22500 },
          { id: "5", asset: "VXUS", type: "ETF", allocation: 10, initialValue: 13000, currentValue: 15000 },
        ],
      },
      {
        id: "2",
        name: "Conservative Portfolio",
        client: "Sarah Johnson",
        startDate: "2023-03-20",
        status: "ACTIVE",
        returns: 8.2,
        totalValue: 85000,
        holdings: [
          { id: "1", asset: "US Treasury", type: "Bond", allocation: 50, initialValue: 40000, currentValue: 42000 },
          { id: "2", asset: "VTI", type: "ETF", allocation: 50, initialValue: 40000, currentValue: 43000 },
        ],
      },
      {
        id: "3",
        name: "Aggressive Growth",
        client: "Michael Chen",
        startDate: "2024-01-10",
        status: "UPCOMING",
        returns: 0,
        totalValue: 0,
        holdings: [],
      },
      {
        id: "4",
        name: "Retirement Portfolio",
        client: "Emma Wilson",
        startDate: "2022-06-15",
        status: "CLOSED",
        returns: 15.8,
        totalValue: 120000,
        holdings: [
          { id: "1", asset: "BND", type: "Bond", allocation: 60, initialValue: 70000, currentValue: 84000 },
          { id: "2", asset: "VTI", type: "ETF", allocation: 40, initialValue: 50000, currentValue: 36000 },
        ],
      },
      {
        id: "5",
        name: "Balanced Portfolio",
        client: "David Brown",
        startDate: "2023-09-01",
        status: "ACTIVE",
        returns: -2.1,
        totalValue: 95000,
        holdings: [
          { id: "1", asset: "AAPL", type: "Stock", allocation: 40, initialValue: 40000, currentValue: 38000 },
          { id: "2", asset: "BND", type: "Bond", allocation: 60, initialValue: 60000, currentValue: 57000 },
        ],
      },
    ]
  },

  getters: {
    getPortfolios: (state) => state.portfolios,
    getClients: (state) => state.clients,
    getClientById: (state) => (id) => state.clients.find(c => c.id === id),
    getPortfolioById: (state) => (id) => state.portfolios.find(p => p.id === id),
    filteredClients: (state) => (searchTerm) => state.clients.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    filteredPortfolios: (state) => (searchTerm, statusTab) => state.portfolios.filter(p =>
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
      p.status === statusTab
    ),
    totalPortfolioValue: (state) => (portfolioId) => {
      const portfolio = state.portfolios.find(p => p.id === portfolioId);
      return portfolio?.holdings?.reduce((sum, h) => sum + h.currentValue, 0) ?? 0;
    }
  },

  mutations: {
    addClient(state, client) {
      client.id = Date.now().toString();
      state.clients.push(client);
    },
    updateClient(state, updatedClient) {
      const index = state.clients.findIndex(c => c.id === updatedClient.id);
      if (index !== -1) state.clients[index] = updatedClient;
    },
    deleteClient(state, clientId) {
      state.clients = state.clients.filter(c => c.id !== clientId);
    },
    addPortfolio(state, portfolio) {
      portfolio.id = Date.now().toString();
      state.portfolios.push(portfolio);
    },
    updatePortfolio(state, updatedPortfolio) {
      const index = state.portfolios.findIndex(p => p.id === updatedPortfolio.id);
      if (index !== -1) state.portfolios[index] = updatedPortfolio;
    },
    deletePortfolio(state, portfolioId) {
      state.portfolios = state.portfolios.filter(p => p.id !== portfolioId);
    }
  },

  actions: {
    saveClient({ commit }, client) {
      if (client.id) commit("updateClient", client);
      else commit("addClient", client);
    },
    removeClient({ commit }, clientId) {
      commit("deleteClient", clientId);
    },
    savePortfolio({ commit }, portfolio) {
      if (portfolio.id) commit("updatePortfolio", portfolio);
      else commit("addPortfolio", portfolio);
    },
    removePortfolio({ commit }, portfolioId) {
      commit("deletePortfolio", portfolioId);
    }
  }
});

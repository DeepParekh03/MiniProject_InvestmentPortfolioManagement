import { createStore } from "vuex";

const LOCAL_STORAGE_CLIENTS = "clients";
const LOCAL_STORAGE_PORTFOLIOS = "portfolios";

const loadFromStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export default createStore({
  state: {
    clients: loadFromStorage(LOCAL_STORAGE_CLIENTS),
    portfolios: loadFromStorage(LOCAL_STORAGE_PORTFOLIOS),
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
    },
  },

  mutations: {
    addClient(state, client) {
      client.id = Date.now().toString();
      state.clients.push(client);
      saveToStorage(LOCAL_STORAGE_CLIENTS, state.clients);
    },
    updateClient(state, updatedClient) {
      const index = state.clients.findIndex(c => c.id === updatedClient.id);
      if (index !== -1) state.clients[index] = updatedClient;
      saveToStorage(LOCAL_STORAGE_CLIENTS, state.clients);
    },
    deleteClient(state, clientId) {
      state.clients = state.clients.filter(c => c.id !== clientId);
      saveToStorage(LOCAL_STORAGE_CLIENTS, state.clients);
    },
    addPortfolio(state, portfolio) {
      portfolio.id = Date.now().toString();
      state.portfolios.push(portfolio);
      saveToStorage(LOCAL_STORAGE_PORTFOLIOS, state.portfolios);
    },
    updatePortfolio(state, updatedPortfolio) {
      const index = state.portfolios.findIndex(p => p.id === updatedPortfolio.id);
      if (index !== -1) state.portfolios[index] = updatedPortfolio;
      saveToStorage(LOCAL_STORAGE_PORTFOLIOS, state.portfolios);
    },
    deletePortfolio(state, portfolioId) {
      state.portfolios = state.portfolios.filter(p => p.id !== portfolioId);
      saveToStorage(LOCAL_STORAGE_PORTFOLIOS, state.portfolios);
    },
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
    },
  }
});

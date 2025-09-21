# 📊 Investment Portfolio Management System

## 1. Introduction
The objective of this project is to digitize client and portfolio management for a wealth management firm.  
The system eliminates data loss, avoids miscommunication, and improves user engagement by providing a centralized platform to manage clients and their investment portfolios.  
The application is built using Vue.js for the frontend, Vuex for state management, localStorage for persistence, and Jest for testing.

---

## 2. Key Features

### Client Management
- Create new clients with name, email, and status.
- Status options: Active, Pending, Inactive.
- Ability to edit client details and change status at any time.
- Delete clients from the system.
- When a client is deleted, all their associated portfolios are also removed.
- **Validations:**
  - Name is required.
  - Email is required, must be in valid format, and must be unique.

### Portfolio Management
- Create portfolios for specific clients.
- Portfolio status options: Upcoming, Active, Closed.
- Edit portfolio details and update holdings.
- View portfolio details including:
  - Client information
  - Holdings (Stocks, Mutual Funds, ETFs, Bonds)
  - Pie chart of allocation
  - Bar chart of returns growth

**Business Rules:**
- Portfolios cannot be created for clients with Inactive status.
- Portfolios with Upcoming status cannot have holdings until activated.
- Portfolios with Closed status cannot add new holdings.

---

## 3. Data Storage & State Management
**Vuex Store:**
- **Clients Module:** Handles client creation, update, deletion, and retrieval.
- **Portfolios Module:** Handles portfolio creation, update, deletion, and retrieval by client or status.

**Local Storage:**
- Ensures persistence across browser sessions.
- Vuex mutations automatically sync state with local storage.

**Single Source of Truth:**
- Components only interact with Vuex, not directly with localStorage.

---

## 4. Application Flow

### Client Flow
1. Manager creates a client in `UserForm.vue`.
2. Client appears in `UserList.vue` with status badge.
3. Manager can edit client details or delete client.
4. Status must be changed to Active before assigning portfolios.

### Portfolio Flow
1. Manager selects client and creates portfolio in `PortfolioForm.vue`.
2. If client is Inactive, system blocks portfolio creation.
3. If status is Upcoming, holdings remain empty.
4. Portfolio appears in `PortfolioList.vue` with correct status filter.
5. Manager clicks portfolio to view details in `PortfolioDetail.vue`.
6. Charts display allocation breakdown and returns history.

---

## 5. Visualization
- **Pie Chart:** Represents portfolio allocation across Stocks, Mutual Funds, ETFs, and Bonds.
- **Bar Chart:** Shows returns history or portfolio growth trend over time.
- Charts provide at-a-glance insights for portfolio optimization.

---

## 6. Testing
The system uses Jest and Vue Test Utils for testing.  

**Test coverage includes:**

- **ClientListForm**
  - Rendering of client table.
  - Render of Header and Addition button.

- **PortfolioListForm**
  - Renders Portfolios List and allows filtering by status (Upcoming, Active, Closed).
  - Render of header and add portfolio button.

- **PortfolioCreationForm**
  - Validation for fields for creation of portfolio.
  - Disabling holdings for upcoming portfolios.

- **PortfolioDetail**
  - Rendering of portfolio status.
  - Display of portfolio and client information.

---

## 7. System Architecture

**Technology Stack:**
- **Frontend Framework:** Vue.js (Composition API)  
- **State Management:** Vuex  
- **Persistence:** Local Storage  
- **Routing:** Vue Router  
- **Testing:** Jest + Vue Test Utils
  
---

## Folder Strucrture
```

├── public/ 
├── src/ 
│ ├── assets/ # Global assets like images, styles, etc.
│ ├── components/ 
│ │ └── LayoutComponent.vue
│ ├── router/
│ │ └── index.js 
│ ├── store/ 
│ │ └── index.js 
│ ├── views/ 
│ │ ├── PortfolioDetail.vue 
│ │ ├── PortfolioForm.vue 
│ │ ├── PortfolioList.vue 
│ │ ├── UserForm.vue 
│ │ └── UserList.vue 
│ ├── App.vue 
│ └── main.js
├── tests/ 
│ └── unit/ 
│ ├── portfolioDetails.spec.js
│ ├── portfolioForm.spec.js
│ ├── portfolioList.spec.js
│ └── userList.spec.js
├── .eslintrc.cjs
├── .gitignore 
├── babel.config.js 
├── jest.config.js 
├── jsconfig.json
├── package.json 
├── package-lock.json 
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vue.config.js
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```
   git clone https://github.com/your-username/portfolio-management.git
   cd portfolio-management

2. **Install dependencies**
   ```
   npm install
   ```
3. **Run the Application**
   ```
   npm run serve
   ```
4. **Run Jest tests**
   Add the following in your package.json under scripts:
  ``` 
   "scripts": {
  "test": "jest"
  }
```
  Run tests:
  ```
  npm run test:unit
  ```
## ⚙️ ESLint Configuration
```
/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  rules: {
    "no-unused-vars": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "off",
    "tailwindcss/migration-from-tailwind-2": "off",
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/no-v-html": "off",
    "vue/attributes-order": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/first-attribute-linebreak": "off",
    "vue/html-indent": "off",
    "vue/html-closing-bracket-newline":"off",
  },
};
```

## 📌 Notes
- Ensure the client is Active before creating portfolios.
- Upcoming portfolios cannot have holdings until they are activated.
- Local storage is used to persist data, while Vuex handles state management.
- Pie charts and bar charts in Portfolio Detail view provide visual insights.

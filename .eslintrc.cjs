/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true, // enables ES2021 globals
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  parserOptions: {
    ecmaVersion: 2021, // supports modern JS
    sourceType: "module",
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  rules: {
    "no-unused-vars": "off", // optional
  },
};

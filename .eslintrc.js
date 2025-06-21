module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2020: true // 👈 Necesario para que ESLint entienda `globalThis`
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
globals: {
  defineProps: 'readonly',
  defineEmits: 'readonly',
  globalThis: 'readonly' // <-- agregalo acá
}
}

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import eslintConfigPrettier from 'eslint-config-prettier'

const sharedGlobals = {
  console: 'readonly',
  document: 'readonly',
  localStorage: 'readonly',
  window: 'readonly',
  Storage: 'readonly',
  crypto: 'readonly',
  HTMLElement: 'readonly',
  HTMLInputElement: 'readonly',
}

const testGlobals = {
  describe: 'readonly',
  it: 'readonly',
  expect: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  vi: 'readonly',
}

export default defineConfigWithVueTs(
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: sharedGlobals,
    },
  },
  {
    files: ['tests/**/*.ts', 'vitest.setup.ts'],
    languageOptions: {
      globals: {
        ...sharedGlobals,
        ...testGlobals,
      },
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  eslintConfigPrettier,
)

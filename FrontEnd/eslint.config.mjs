import { fixupConfigRules } from '@eslint/compat'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
 baseDirectory: __dirname,
 recommendedConfig: js.configs.recommended,
 allConfig: js.configs.all,
})

export default [
 {
  ignores: ['./src/app/components/ui/*.tsx'],
 },
 ...fixupConfigRules(
  compat.extends(
   'next/core-web-vitals',
   'plugin:react/recommended',
   'plugin:react/jsx-runtime',
   'plugin:react-hooks/recommended',
   'eslint:recommended',
   'plugin:prettier/recommended',
  ),
 ),
 {
  languageOptions: {
   globals: {
    ...globals.browser,
   },
  },
  rules: {},
 },
 eslintPluginPrettierRecommended,
]

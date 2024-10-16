import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginPrettier from 'eslint-plugin-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
 baseDirectory: __dirname,
 recommendedConfig: js.configs.recommended,
 allConfig: js.configs.all,
})

const settings = [
 {
  ignores: ['./src/app/components/ui/*.tsx', '.next/', 'node_modules/'],
 },
 ...compat.extends(
  'next/core-web-vitals',
  'plugin:react/recommended',
  'plugin:react/jsx-runtime',
  'plugin:react-hooks/recommended',
  'eslint:recommended',
  'plugin:prettier/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
 ),
 {
  languageOptions: {
   globals: {
    ...globals.browser,
   },
  },
  plugins: {
   prettier: eslintPluginPrettier,
  },
  rules: {
   'prettier/prettier': 'error',
  },
 },
]

export default settings

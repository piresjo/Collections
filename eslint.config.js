import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        ignores: ['coverage/**', 'public/javascript/bootstrap.bundle.min.js'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
])

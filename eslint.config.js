import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
    { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        ignores: ['node_modules', 'dist', 'public', '.nuxt']
    },
    eslintConfigPrettier,
    {
        files: ['**/*.vue'],
        languageOptions: { parserOptions: { parser: tseslint.parser } }
    },
    {
        rules: {
            // Enforce trailing commas where possible
            'comma-dangle': ['off'],
            semi: ['off'],
            '@typescript-eslint/no-explicit-any': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/attribute-hyphenation': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'vue/no-deprecated-slot-attribute': [
                'error',
                {
                    ignore: ['my-component']
                }
            ]
        }
    }
])

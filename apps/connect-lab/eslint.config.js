//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  ...tanstackConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['src/**'],
    rules: {
      'node/prefer-node-protocol': 'off',
    },
  },
]

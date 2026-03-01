//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [...tanstackConfig, eslintPluginPrettierRecommended]

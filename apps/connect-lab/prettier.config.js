/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  semi: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 120,
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config

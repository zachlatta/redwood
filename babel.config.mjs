// We use the recommended babel configuration for monorepos, which is a base directory
// `babel.config.mjs` file, but then use a per-project `.babelrc.mjs` file.
// Learn more: https://babeljs.io/docs/en/config-files#monorepos

const TARGETS_NODE = '12.13.0'
const TARGETS_BROWSERS = 'defaults'
const CORE_JS_VERSION = '3.6.0'

/**
 * Preset for targetting an environment, either "node" or "browsers"
 */
export const presetEnvConfig = (target, ...rest) => {
  return [
    '@babel/preset-env',
    {
      targets:
        target === 'node'
          ? { node: TARGETS_NODE }
          : { browsers: TARGETS_BROWSERS },
      useBuiltIns: 'usage',
      corejs: CORE_JS_VERSION,
      ...rest,
    },
  ]
}

/**
 * Adds an alias of `src/` to the base `./src` directory of a package.
 *
 * @example
 * ```js
 * // Old way:
 * import { ComponentName } from '../../components/ComponentName'
 * // New way:
 * import { ComponentName } from 'src/components/ComponentName'
 * ```
 */
export const pluginModuleResolveAliasSrcDir = () => {
  return [
    'babel-plugin-module-resolver',
    {
      alias: {
        src: './src',
      },
    },
  ]
}

export default {
  presets: ['@babel/preset-react', '@babel/typescript'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-export-default-from'],
    ['@babel/plugin-proposal-object-rest-spread'],
  ],
  ignore: ['**/*.test.js', '**/__tests__', '**/__mocks__'],
}

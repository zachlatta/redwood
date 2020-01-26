import pluginTester from 'babel-plugin-tester'
import plugin from 'babel-plugin-macros'

const MACRO_IMPORT_PATH = '../importAll.macro.js'

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: {
    filename: __filename,
  },
  tests: {
    'api.services': `
      import importAll from '${MACRO_IMPORT_PATH}'
      const serviceImports = importAll('./fixtures/api/src/services/')
    `,
    'api.graphql': `
      import importAll from '${MACRO_IMPORT_PATH}'
      const graphQLImports = importAll('./fixtures/api/src/graphql/')
    `,
  },
})

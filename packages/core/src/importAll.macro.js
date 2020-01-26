const path = require('path')

const { createMacro } = require('babel-plugin-macros')
const glob = require('glob')

// This code is copied from `importAll.macro`
// https://github.com/kentcdodds/import-all.macro

function prevalMacros({ references, state, babel }) {
  references.default.forEach((referencePath) => {
    if (referencePath.parentPath.type === 'CallExpression') {
      importAll({ referencePath, state, babel })
    } else {
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please use "importAll(path/to/files)"`
      )
    }
  })
}

const getGlobPattern = (callExpressionPath) => {
  try {
    const argValue = callExpressionPath.parentPath
      .get('arguments')[0]
      .evaluate().value
    return `${argValue}/*.{ts,js}`
  } catch (e) {
    throw new Error('The')
  }
}

function importAll({ referencePath, state, babel }) {
  const t = babel.types

  const filename = state.file.opts.filename

  const globPattern = getGlobPattern(referencePath)

  const importSources = glob.sync(globPattern, {
    cwd: path.dirname(filename),
  })

  const { importNodes, objectProperties } = importSources.reduce(
    (all, source) => {
      const id = referencePath.scope.generateUidIdentifier(source)
      all.importNodes.push(
        t.importDeclaration(
          [t.importNamespaceSpecifier(id)],
          t.stringLiteral(source)
        )
      )

      // Turn `./relativePath/a.js` into `a`.
      const objectKey = path
        .basename(source, path.extname(source))
        .replace('.sdl', '')
      all.objectProperties.push(
        t.objectProperty(t.stringLiteral(objectKey), id)
      )
      return all
    },
    { importNodes: [], objectProperties: [] }
  )

  const program = state.file.path
  program.node.body.unshift(...importNodes)

  const objectExpression = t.objectExpression(objectProperties)
  referencePath.parentPath.replaceWith(objectExpression)
}

export default createMacro(prevalMacros)

import { ApolloServer, Config } from 'apollo-server-lambda'

/**
 * An Apollo serverless GraphqL server wrapper
 *
 * ```js
 * export const handler = server({ schema, context }).createHandler()
 * ```
 */
export const server = (options: Config): ApolloServer => {
  // import the schema

  return new ApolloServer(options)
}

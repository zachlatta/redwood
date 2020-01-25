import { DocumentNode, GraphQLSchema } from 'graphql'
// types
import { mergeSchemas, gql } from 'apollo-server-lambda'
import merge from 'lodash.merge'
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'

import {
  SchemaDefinition,
  MakeSchemaInterface,
  MapFunctionsToSchemaInterface,
} from './types'

/**
 * Adds scalar types for dealing with Date, Time, and DateTime.
 * Adds a root Query type which allows our GraphQL server to launch, on a fresh
 * project, without throwing an execption.
 */
export const rootSchemaDefinition = (): SchemaDefinition => ({
  schema: gql`
    scalar Date
    scalar Time
    scalar DateTime

    type Redwood {
      version: String
    }

    type Query {
      redwood: Redwood
    }
  `,
  resolvers: {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    Query: {
      redwood: () => ({
        version: '0.0.0',
      }),
    },
  },
})

export const mapFunctionsToSchema = ({
  type,
  schema,
  resolvers,
  servicesFunctions,
  debug = true,
}: MapFunctionsToSchemaInterface): {
  [fieldName: string]: CallableFunction
} => {
  // @ts-ignore
  const fields = schema.getType(type)?.getFields()
  return Object.keys(fields).reduce((newResolvers, fieldName) => {
    if (resolvers[type][fieldName]) {
      if (debug) {
        console.info(`${type}.${fieldName} found in resolvers.`)
      }
      return newResolvers
    }

    if (servicesFunctions[fieldName]) {
      if (debug) {
        console.info(`${type}.${fieldName} found in services.`)
      }
      return {
        ...newResolvers,
        [fieldName]: servicesFunctions[fieldName],
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `${type}.${fieldName} could not be found in resolvers or services functions.`
      )
    }

    return newResolvers
  }, {})
}

export const makeSchema = ({
  graphQLImports,
  servicesImports,
}: MakeSchemaInterface): GraphQLSchema => {
  // Discard the path information from the imported files.
  const schemaDefinitions = Object.values(graphQLImports)
  const servicesFunctions = merge({}, ...Object.values(servicesImports))

  // Prepare the schema type definitions to be merged into a single schema.
  const {
    schema: rootSchema,
    resolvers: rootResolvers,
  } = rootSchemaDefinition()
  const schemas = [
    rootSchema,
    ...schemaDefinitions.map(({ schema }) => schema),
  ] as Array<DocumentNode>

  const mergedSchema = mergeSchemas({ schemas })

  // We want to automatically map functions exported from services (./api/src/services)
  // to the `Query` and `Mutation` types in our merged schema.
  // Resolver functions take precedence over services functions.

  // Merge all of our resolvers into a single object so that we can easily identify
  // which schema fields do not have resolvers associated to them.
  const resolvers = merge(
    rootResolvers,
    ...schemaDefinitions.map(({ resolvers }) => resolvers)
  )

  const newQueryTypeResolvers = mapFunctionsToSchema({
    type: 'Query',
    schema: mergedSchema,
    resolvers,
    servicesFunctions,
  })
  const newMutationTypeResolvers = mapFunctionsToSchema({
    type: 'Mutation',
    schema: mergedSchema,
    resolvers,
    servicesFunctions,
  })

  return mergeSchemas({
    schemas,
    resolvers: {
      Query: {
        ...resolvers.Query,
        ...newQueryTypeResolvers,
      },
      Mutation: {
        ...resolvers.Mutation,
        ...newMutationTypeResolvers,
      },
      ...resolvers,
    },
  })
}

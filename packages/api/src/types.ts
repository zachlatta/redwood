import { GraphQLSchema, DocumentNode } from 'graphql'
import { IResolvers } from 'graphql-tools'

export type GraphQLImports = Array<{
  [path: string]: Array<SchemaDefinition>
}>

export type ServicesImports = Array<{
  [path: string]: Array<ServiceFunctions>
}>

export interface MakeSchemaInterface {
  graphQLImports: GraphQLImports
  servicesImports: ServicesImports
}

export interface MapFunctionsToSchemaInterface {
  type: 'Query' | 'Mutation'
  schema: GraphQLSchema
  resolvers: IResolvers
  servicesFunctions: ServiceFunctions
  debug?: boolean
}

export type SchemaDefinition = {
  schema: DocumentNode | GraphQLSchema
  resolvers?: IResolvers
}

export type ServiceFunctions = {
  [serviceFunctionName: string]: CallableFunction
}

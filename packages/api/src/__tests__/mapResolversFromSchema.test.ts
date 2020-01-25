import importAll from 'import-all.macro'
import {
  GraphQLSchema,
  getIntrospectionQuery,
  getNamedType,
  buildSchema,
} from 'graphql'
import { gql } from 'apollo-server-lambda'

import { GraphQLImports } from './types'

const graphQLImports = importAll.sync(
  '../__mocks__/graphql/*.sdl.{js,ts}'
) as GraphQLImports
const servicesImports = importAll.sync('../__mocks__/services/*.{js,ts}')

import { makeSchema } from '../makeMergedSchema'

/**
 * function forEachField(schema: GraphQLSchema, fn: IFieldIteratorFn): void {
  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];

    // TODO: maybe have an option to include these?
    if (
      !getNamedType(type).name.startsWith('__') &&
      type instanceof GraphQLObjectType
    ) {
      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        fn(field, typeName, fieldName);
      });
    }
  });
}

 * forEachField(schema, (field, typeName, fieldName) => {
    // requires a resolve function for *every* field.
    if (requireResolversForAllFields) {
      expectResolveFunction(field, typeName, fieldName);
    }

    // requires a resolve function on every field that has arguments
    if (requireResolversForArgs && field.args.length > 0) {
      expectResolveFunction(field, typeName, fieldName);
    }

    // requires a resolve function on every field that returns a non-scalar type
    if (
      requireResolversForNonScalar &&
      !(getNamedType(field.type) instanceof GraphQLScalarType)
    ) {
      expectResolveFunction(field, typeName, fieldName);
    }
  });

  function expectResolveFunction(
  field: GraphQLField<any, any>,
  typeName: string,
  fieldName: string,
) {
  if (!field.resolve) {
    console.warn(
      // tslint:disable-next-line: max-line-length
      `Resolve function missing for "${typeName}.${fieldName}". To disable this warning check https://github.com/apollostack/graphql-tools/issues/131`,
    );
    return;
  }
  if (typeof field.resolve !== 'function') {
    throw new SchemaError(
      `Resolver "${typeName}.${fieldName}" must be a function`,
    );
  }
}
 */

describe('mapServiceExportsToSchemaResolvers', () => {
  // given a schema we need to parse it.

  it('does shit', () => {
    // import the services

    makeSchema({ graphQLImports, servicesImports })

    //console.log(sdlFiles, serviceFiles)

    // const makeMergedSchema({
    //   schemas:
    // })

    //const schema = makeMergedSchema([dogsSDL], [dogsService])

    // const types = schema.getTypeMap()
    // const { Query, Mutation } = types

    // const fields = Query.getFields()
    // foreach field in
    // //    console.log(fieldNames)

    // console.log(Query.getFields().map(x => {
    //   console.log(x)
    //   return '1'
    // }))

    expect(true).toEqual(true)
  })
})

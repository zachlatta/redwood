import { gql } from 'apollo-server-lambda'

export const schema = gql`
  type Dog implements Animal {
    zoomies: Boolean
  }

  type Query {
    dog: Dog
    dogs: [Dog]
  }
`

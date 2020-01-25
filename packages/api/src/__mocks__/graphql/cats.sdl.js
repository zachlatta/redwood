import { gql } from 'apollo-server-lambda'

export const schema = gql`
  type Cat implements Animal {
    purr: Boolean
  }

  type Query {
    cat: Dog
    cats: [Dog]
  }
`

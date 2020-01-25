import { gql } from 'apollo-server-lambda'

export const schema = gql`
  interface Animal {
    legs: Int
    sound: String
  }
`

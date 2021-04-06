import { gql } from "apollo-server";

export default gql`
    type Subscription {
        roomUpdate(id:Int!): Message
    }
`
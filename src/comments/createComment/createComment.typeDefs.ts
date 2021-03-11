import { gql } from "apollo-server-core";

export default gql`
    type Mutation {
        createComment(id:Int! payload:String!) : MutationResponse!
    }
`
import { gql } from "apollo-server-core";

export default gql`
    type Mutation{
        deleteRoom(roomId:Int!) : MutationResponse!
    }
`
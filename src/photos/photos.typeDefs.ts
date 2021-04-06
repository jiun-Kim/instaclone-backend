import { gql } from "apollo-server";

export default gql`
    type Photo {
        id: Int!
        user: User!
        userId: Int!
        file: String!
        caption: String
        hashtags: [Hashtag]
        likes: Int!
        isLiked: Boolean!
        comments: [Comment]
        commentNumbers: Int!
        isMine: Boolean!
        createdAt: String!
        updatedAt: String!
    }
    type Hashtag {
        id: Int!
        hashtag: String!
        photos(page:Int!): [Photo] 
        createdAt: String!
        updatedAt: String!
    }
`
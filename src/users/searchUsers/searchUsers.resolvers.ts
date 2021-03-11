import { Resolvers } from "../../types"

const resolvers: Resolvers = {
    Query: {
        searchUsers: (_, { keyword, cursor }, { client }) => {
            return client.user.findMany({
                where: {
                    username: {
                        startsWith: keyword.toLowerCase()
                    }
                },
                take: 5,
                skip: cursor ? 1 : 0,
                ...(cursor && { cursor: { id: cursor } })
            })
        }
    }
}
export default resolvers
import { Resolvers } from "../../types"

const resolvers: Resolvers = {
    Query: {
        seeFollowing: async (_, { username, cursor }, { client }) => {
            const ok = await client.user.findUnique({
                where: { username },
                select: {
                    id: true
                }
            })
            if (!ok) {
                return {
                    ok: true,
                    error: "User not found"
                }
            }
            const following = await client.user.findUnique({
                where: { username }
            }).following({
                take: 5,
                skip: cursor ? 1 : 0,
                ...(cursor && { cursor: { id: cursor } })
            })
            return {
                ok: true,
                following
            }
        }
    }
}

export default resolvers
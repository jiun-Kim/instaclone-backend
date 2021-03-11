import client from "../client"
import { Resolvers } from "../types"

const resolvers: Resolvers = {
    User: {
        totalFollowers: ({ id }, _, { client }) => {
            return client.user.count({
                where: {
                    following: {
                        some: { id }
                    }
                }
            })
        },
        totalFollowing: ({ id }, _, { client }) => {
            return client.user.count({
                where: {
                    following: {
                        some: { id }
                    }
                }
            })
        },
        isMe: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false
            }
            return id === loggedInUser.id
        },
        isFollowing: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false
            }
            const exists = await client.user.count({
                where: {
                    username: loggedInUser.username,
                    following: {
                        some: { id }
                    }
                }
            })
            return Boolean(exists)
        },
        photos: ({ id }, _, { client }) => {
            return client.user.findUnique({
                where: {
                    id
                }
            }).photos()
        }
    }
}

export default resolvers
import { Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"

const resolvers: Resolvers = {
    Mutation: {
        deleteComment: protectedResolver(async (_, { id }, { client, loggedInUser }) => {
            const comment = await client.comment.findUnique({
                where: {
                    id
                },
                select: {
                    userId: true
                }
            })
            if (!comment) {
                return {
                    ok: false,
                    error: "Can't found Comment"
                }
            }
            else if (comment.userId !== loggedInUser.id) {
                return {
                    ok: false,
                    error: "You don't have access to this Comment"
                }
            }
            else {
                await client.comment.delete({
                    where: {
                        id
                    }
                })
                return {
                    ok: true
                }
            }
        })
    }
}

export default resolvers
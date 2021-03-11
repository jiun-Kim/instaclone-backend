import { Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"

const resolvers: Resolvers = {
    Mutation: {
        createComment: protectedResolver(async (_, { id, payload }, { client, loggedInUser }) => {
            const ok = await client.photo.findUnique({
                where: {
                    id
                },
                select: {
                    id: true
                }
            })
            if (!ok) {
                return {
                    ok: false,
                    error: "Can not found photo"
                }
            }
            await client.comment.create({
                data: {
                    payload,
                    user: {
                        connect: {
                            id: loggedInUser.id
                        }
                    },
                    photo: {
                        connect: {
                            id
                        }
                    }
                },
            });
            return {
                ok: true
            }
        })
    }
}

export default resolvers
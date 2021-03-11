import { Resolvers } from "../../types"

const resolvers: Resolvers = {
    Mutation: {
        readMessage: async (_, { id }, { client, loggedInUser }) => {
            const message = await client.messege.findFirst({
                where: {
                    id,
                    userId: {
                        not: loggedInUser.id
                    },
                    room: {
                        users: {
                            some: {
                                id: loggedInUser.id
                            }
                        }
                    }
                }
            })
            if (!message) {
                return {
                    ok: false,
                    error: "Message is not found"
                }
            }
            await client.messege.update({
                where: {
                    id,
                },
                data: {
                    read: true
                }
            })
            return {
                ok: true
            }
        }
    }
}

export default resolvers
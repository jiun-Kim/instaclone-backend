import { Resolvers } from "../types"

const resolvers: Resolvers = {
    Room: {
        users: ({ id }, _, { client }) => client.room.findUnique({
            where: {
                id
            }
        }).users(),
        messages: ({ id }, _, { client }) => client.messege.findMany({
            where: {
                roomId: id
            }
        }),
        unreadTotal: ({ id }, _, { client, loggedInUser }) => {
            if (!loggedInUser) {
                return 0
            }
            return client.messege.count({
                where: {
                    roomId: id,
                    read: false,
                    user: {
                        id: {
                            not: loggedInUser.id
                        }
                    }
                },
            })
        }
    }
}

export default resolvers
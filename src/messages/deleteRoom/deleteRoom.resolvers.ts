import { Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"

const resolvers: Resolvers = {
    Mutation: {
        deleteRoom: protectedResolver(async (_, { roomId }, { client, loggedInUser }) => {
            const room = await client.room.findUnique({
                where: {
                    id: roomId
                },
                select: {
                    id: true
                }
            })
            if (!room) {
                return {
                    ok: false,
                    error: "Room has been deleted!"
                }
            }
            await client.messege.deleteMany({
                where: {
                    roomId: roomId
                }
            })
            await client.room.delete({
                where: {
                    id: roomId
                }
            })
            return {
                ok: true
            }
        })
    }
}

export default resolvers
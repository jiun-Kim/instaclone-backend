import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"

const resolvers: Resolvers = {
    Mutation: {
        sendMessage: protectedResolver(
            async (_, { payload, userId, roomId }, { client, loggedInUser }) => {
                let room = null;
                if (userId) {
                    const user = await client.user.findUnique({
                        where: {
                            id: userId
                        },
                        select: {
                            id: true
                        }
                    })
                    if (!user) {
                        return {
                            ok: false,
                            error: "User does not exist!"
                        }
                    }
                    const existRoom = await client.room.findFirst({
                        where: {
                            users: {
                                some: {
                                    id: userId
                                }
                            }
                        },
                        select: {
                            id: true
                        }
                    })
                    if (existRoom) {
                        return {
                            ok: false,
                            error: "The Room already exist!"
                        }
                    }
                    room = await client.room.create({
                        data: {
                            users: {
                                connect: [
                                    {
                                        id: user.id
                                    },
                                    {
                                        id: loggedInUser.id
                                    }
                                ]
                            }
                        }
                    })
                }
                else if (roomId) {
                    room = await client.room.findUnique({
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
                            error: "Room does not exist!"
                        }
                    }
                }
                const message = await client.messege.create({
                    data: {
                        payload,
                        room: {
                            connect: {
                                id: room.id
                            }
                        },
                        user: {
                            connect: {
                                id: loggedInUser.id
                            }
                        }
                    }
                })
                pubsub.publish(NEW_MESSAGE, { roomUpdate: { ...message } })
                return {
                    ok: true
                }

            })
    }
}

export default resolvers
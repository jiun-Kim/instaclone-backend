import { Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"

const resolvers: Resolvers = {
    Mutation: {
        toggleLike: protectedResolver(
            async (_, { id }, { client, loggedInUser }) => {

                const photo = await client.photo.findUnique({
                    where: {
                        id
                    }
                })
                if (!photo) {
                    return {
                        ok: false,
                        error: "Can't found photo"
                    }
                }
                const like = await client.like.findUnique({
                    where: {
                        photoId_userId: {
                            photoId: photo.id,
                            userId: loggedInUser.id
                        }
                    }
                })
                if (like) {
                    await client.like.delete({
                        where: {
                            photoId_userId: {
                                photoId: photo.id,
                                userId: loggedInUser.id
                            }
                        }
                    })
                } else {
                    await client.like.create({
                        data: {
                            user: {
                                connect: {
                                    id: loggedInUser.id
                                }
                            },
                            photo: {
                                connect: {
                                    id: photo.id
                                }
                            }
                        }
                    })
                }
                return {
                    ok: true
                }
            }
        )
    }
}

export default resolvers
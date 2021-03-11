import { Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"
import { processHashtags } from "../photos.utils"

const resolvers: Resolvers = {
    Mutation: {
        editPhoto: protectedResolver(async (_, { id, caption }, { client, loggedInUser }) => {
            const oldPhoto = await client.photo.findFirst({
                where: {
                    id,
                    userId: loggedInUser.id
                },
                include: {
                    hashtags: {
                        select: {
                            hashtag: true
                        }
                    }
                }
            })
            if (!oldPhoto) {
                return {
                    ok: false,
                    error: "Can't found photos"
                }
            }
            await client.photo.update({
                where: {
                    id
                },
                data: {
                    caption,
                    hashtags: {
                        disconnect: oldPhoto.hashtags,
                        connectOrCreate: processHashtags(caption)
                    }
                },
            })
            return {
                ok: true
            }
        })
    }
}

export default resolvers
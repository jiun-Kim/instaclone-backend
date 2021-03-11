
import { uploadToS3 } from "../../shared/shared.utils"
import { Resolver, Resolvers } from "../../types"
import { protectedResolver } from "../../users/users.utils"
import { processHashtags } from "../photos.utils"

const uploadPhotoFn: Resolver = async (_, { file, caption }, { client, loggedInUser }) => {
    let hashtagObj = []

    if (caption) {
        hashtagObj = processHashtags(caption)
    }
    const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads")
    return client.photo.create({
        data: {
            file: fileUrl,
            caption,
            user: {
                connect: {
                    id: loggedInUser.id
                }
            },
            ...(hashtagObj.length > 0 && {
                hashtags: {
                    connectOrCreate: hashtagObj
                }
            })
        },
    })
}

const resolvers: Resolvers = {
    Mutation: {
        uploadPhoto: protectedResolver(uploadPhotoFn)
    }
}

export default resolvers
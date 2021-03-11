import { Resolvers } from "../types"

const resolvers: Resolvers = {
    Photo: {
        user: ({ userId }, _, { client }) => {
            return client.user.findUnique({
                where: {
                    id: userId
                }
            })
        },
        hashtags: ({ id }, _, { client }) => {
            return client.hashtag.findMany({
                where: {
                    photos: {
                        some: {
                            id
                        }
                    }
                }
            })
        },
        likes: ({ id }, _, { client }) => {
            return client.like.count({
                where: {
                    photoId: id
                }
            })
        },
        comments: ({ id }, _, { client }) => {
            return client.comment.count({
                where: {
                    photoId: id
                },
            })
        },
        isMine: ({ userId }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return false
            }
            return userId === loggedInUser.id
        }
    },
    Hashtag: {
        photos: ({ id }, { page }, { client }) => {
            return client.hashtag.findUnique({
                where: {
                    id
                }
            }).photos({
                take: 2,
                skip: (page - 1) * 2
            })
        }
    }
}

export default resolvers
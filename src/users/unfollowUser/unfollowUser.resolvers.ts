import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const unfollowUserFn: Resolver = async (_, { username }, { client, loggedInUser }) => {

    const ok = await client.user.findUnique({
        where: {
            username
        }
    })

    if (!ok) {
        return {
            ok: false,
            error: "That user does not exist."
        }
    }

    await client.user.update({
        where: {
            id: loggedInUser.id
        },
        data: {
            following: {
                disconnect: {
                    username
                }
            }
        }
    })
    return {
        ok: true
    }
}

const resolvers: Resolvers = {
    Mutation: {
        unfollowUser: protectedResolver(unfollowUserFn)
    }
}

export default resolvers
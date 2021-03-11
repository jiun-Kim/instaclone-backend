import * as bcrypt from "bcrypt";
import { uploadToS3 } from "../../shared/shared.utils";
import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser, client }
) => {
  let avatarUrl = null
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars")
  }
  let hashPassword = null;
  if (newPassword) {
    hashPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(hashPassword && { password: hashPassword }),
      avatar: avatarUrl
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};

export default resolvers
import client from "../client";
import * as jwt from "jsonwebtoken";
import { Resolver } from "../types";

export const getUser = async (token: any) => {
  try {
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const protectedResolver = (ourResolver: Resolver) => (
  root,
  args,
  context,
  info
) => {
  if (!context.loggedInUser) {
    if (info.operation.operation === "query") {
      return null
    }
    else {
      return {
        ok: false,
        error: "Please log in to platform this action.",
      };
    }
  }
  return ourResolver(root, args, context, info);
};

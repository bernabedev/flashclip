import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User as PrismaUser } from "@prisma/client";

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function getOrCreateDbUserFromClerk(): Promise<PrismaUser> {
  const { userId: clerkAuthUserId } = await auth();
  const client = await clerkClient();

  console.log("clerkAuthUserId", clerkAuthUserId);

  if (!clerkAuthUserId) {
    throw new ApiError("User not authenticated.", 401);
  }

  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkAuthUserId },
  });

  if (!dbUser) {
    try {
      const clerkUser = await client.users.getUser(clerkAuthUserId);
      if (!clerkUser) {
        throw new ApiError("Authenticated user not found in Clerk.", 404);
      }

      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.emailAddresses.find(
            (e) => e.id === clerkUser.primaryEmailAddressId
          )?.emailAddress,
          username: clerkUser.username,
        },
      });
    } catch (error) {
      console.error("Error fetching user from Clerk or creating in DB:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("Failed to synchronize user with database.", 500);
    }
  }
  return dbUser;
}

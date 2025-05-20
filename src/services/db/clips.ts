import { Clip, Prisma } from "@/generated/prisma";
import { PaginateFunction, paginator } from "@/lib/paginator";
import { prisma } from "@/lib/prisma";

const paginate: PaginateFunction = paginator({ perPage: 20 });

export class ClipService {
  static async getClips() {
    const clips = await paginate<Clip, Prisma.ClipFindManyArgs>(prisma.clip, {
      include: {
        user: true,
      },
      where: {
        isPublic: true,
      },
    });
    return clips;
  }
  static async getClipsByUserId(userId: string) {
    const clips = await paginate<Clip, Prisma.ClipFindManyArgs>(prisma.clip, {
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
    return clips;
  }
}

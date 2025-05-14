import { prisma } from "@/lib/prisma";
import { ApiError, getOrCreateDbUserFromClerk } from "@/lib/server-utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

interface CreateClipData {
  title: string;
  url: string;
  thumbnailUrl?: string;
  authorName?: string;
  duration?: number; // en ms
  size?: number; // en MB
  width?: number;
  height?: number;
}

export async function POST(request: Request) {
  try {
    const dbUser = await getOrCreateDbUserFromClerk();
    const body = (await request.json()) as CreateClipData;

    if (!body.title || !body.url) {
      throw new ApiError("Missing required fields: title, url.", 400);
    }

    const newClip = await prisma.clip.create({
      data: {
        ...body,
        userId: dbUser.id,
      },
    });
    return NextResponse.json(newClip, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      (error.meta?.target as string[])?.includes("url")
    ) {
      return NextResponse.json(
        { message: "This Twitch clip has already been saved." },
        { status: 409 }
      );
    }
    console.error("[API_CLIPS_POST]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dbUser = await getOrCreateDbUserFromClerk();

    const clips = await prisma.clip.findMany({
      where: {
        userId: dbUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(clips);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[API_CLIPS_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

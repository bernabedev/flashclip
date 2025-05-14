import { prisma } from "@/lib/prisma";
import { ApiError, getOrCreateDbUserFromClerk } from "@/lib/server-utils";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    clipId: string;
  };
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { clipId } = params;
    if (!clipId) {
      throw new ApiError("Clip ID is required.", 400);
    }

    const dbUser = await getOrCreateDbUserFromClerk();

    const clip = await prisma.clip.findUnique({
      where: { id: clipId },
    });

    if (!clip) {
      throw new ApiError("Clip not found.", 404);
    }

    if (clip.userId !== dbUser.id) {
      throw new ApiError("User not authorized to delete this clip.", 403);
    }

    await prisma.clip.delete({
      where: {
        id: clipId,
      },
    });
    return NextResponse.json(
      { message: "Clip deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[API_CLIPS_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

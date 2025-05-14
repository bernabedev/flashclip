import { ApiError, getOrCreateDbUserFromClerk } from "@/lib/server-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbUser = await getOrCreateDbUserFromClerk();
    return NextResponse.json(dbUser);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    console.error("[API_USERS_ME_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

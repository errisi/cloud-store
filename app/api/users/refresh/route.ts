import { NextRequest, NextResponse } from "next/server";
import { generateTokens } from "../route";
import { jwtService } from "@/app/services/jwt.service";
import { tokenService } from "@/app/services/token.service";
import { Users } from "@/app/models/user.model";

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await tokenService.getByToken(refreshToken);
  const user = jwtService.verifyRefresh(refreshToken);

  if (!user || !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await generateTokens(user as Users);

  if (!response) {
    const errorResponse = new NextResponse(
      JSON.stringify({ error: "Failed to generate tokens" }),
      { status: 500 }
    );
    return errorResponse;
  }

  return response;
}

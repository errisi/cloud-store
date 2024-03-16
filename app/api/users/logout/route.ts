import { Users } from "@/app/models/user.model";
import { jwtService } from "@/app/services/jwt.service";
import { tokenService } from "@/app/services/token.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "invalid refreshToken" },
      { status: 400 }
    );
  }

  const userData = await jwtService.verifyRefresh(refreshToken);

  const user = userData as Users;

  if (!user || !refreshToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await tokenService.remove(user.id);

  return NextResponse.json({ message: "success" });
}
